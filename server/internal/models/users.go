package models

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/asxraj/gistbin/internal/validator"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrDuplicateEmail = errors.New("duplicate email")
)

type User struct {
	ID       int64    `json:"id"`
	Username string   `json:"username"`
	Email    string   `json:"email"`
	Password password `json:"-"`
}

type password struct {
	plaintext *string
	hash      []byte
}

func (p *password) Set(plaintextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plaintextPassword), 12)
	if err != nil {
		return err
	}

	p.plaintext = &plaintextPassword
	p.hash = hash

	return nil

}

func (p *password) Matches(plaintextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}

	return true, nil
}

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(validator.Matches(email, validator.EmailRX), "email", "must be a valid email addres")
}

func ValidatePasswordPlaintext(v *validator.Validator, password password) {
	v.Check(*password.plaintext != "", "password", "must be provided")
	v.Check(len(*password.plaintext) >= 8, "password", "must be atleast 8 bytes long")
	v.Check(len(*password.plaintext) <= 72, "password", "must not be more than 72 bytes")
}

func ValidateUser(v *validator.Validator, user *User) {
	v.Check(user.Username != "", "username", "must be provided")
	v.Check(len(user.Username) <= 16, "name", "must not be more than 16 bytes long")

	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, user.Password)
	}

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

type UserModel struct {
	DB *sql.DB
}

func (m UserModel) Insert(user *User) error {
	query := `
        INSERT INTO users (username, email, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING id
    `

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []any{user.Username, user.Email, user.Password.hash}

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&user.ID)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return ErrDuplicateEmail
		default:
			return err
		}
	}

	return nil
}

func (m UserModel) GetUserByEmail(user *User) error {
	query := `
        SELECT id, username, email, hashed_password
        FROM users 
        WHERE email = $1
    `

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, user.Email).Scan(&user.ID, &user.Username, &user.Email, &user.Password.hash)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}

	return nil
}
