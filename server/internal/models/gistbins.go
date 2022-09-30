package models

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/asxraj/gistbin/internal/validator"
)

type GistbinModel struct {
	DB *sql.DB
}

type Gistbin struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
	Expires   time.Time `json:"expires"`
	UserID    int       `json:"user_id"`
}

func ValidateGistbin(v *validator.Validator, gistbin *Gistbin) {
	v.Check(gistbin.Title != "", "title", "must be provided")
	v.Check(len(gistbin.Title) <= 100, "title", "must not be more than 100 bytes long")

	v.Check(gistbin.Content != "", "content", "must be provided")

	v.Check(validator.PermittedValue(gistbin.Category, "None", "Coding", "Cryptocurrency", "Finance", "Food", "Gaming", "Movies"), "category", "category does not exist")

	v.Check(gistbin.Expires.After(time.Now()), "expires", "cannot be before created time")
}

func (m GistbinModel) Insert(gistbin *Gistbin) error {
	var query string
	if gistbin.UserID == 0 {
		query = `
        INSERT INTO gistbins (title, content, category, expires)
        VALUES ($1, $2, $3, $4) 
        RETURNING id, created_at, expires
    `
	} else {
		query = `
        INSERT INTO gistbins (title, content, category, expires, user_id)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, created_at, expires
		`
	}

	args := []any{gistbin.Title, gistbin.Content, gistbin.Category, gistbin.Expires, gistbin.UserID}
	if gistbin.UserID == 0 {
		args = args[:len(args)-1]
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRowContext(ctx, query, args...).Scan(&gistbin.ID, &gistbin.CreatedAt, &gistbin.Expires)
}

func (m GistbinModel) Get(id int64) (*Gistbin, error) {
	query := `
		SELECT id, title, content, category, created_at, expires, user_id 
		FROM gistbins 
		WHERE id = $1 AND now() < expires
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gistbin Gistbin

	err := m.DB.QueryRowContext(ctx, query, id).Scan(&gistbin.ID, &gistbin.Title, &gistbin.Content, &gistbin.Category, &gistbin.CreatedAt, &gistbin.Expires, &gistbin.UserID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &gistbin, nil
}

func (m GistbinModel) GetAll(id int64) ([]*Gistbin, error) {
	query := `
        SELECT id, title, content, expires
        FROM gistbins
		WHERE now() < expires
		AND user_id = $1
		ORDER BY id
    `

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gistbins []*Gistbin

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var gistbin Gistbin
		err = rows.Scan(&gistbin.ID, &gistbin.Title, &gistbin.Content, &gistbin.Expires)
		if err != nil {
			return nil, err
		}
		gistbins = append(gistbins, &gistbin)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return gistbins, nil
}

func (m GistbinModel) Update(gistbin *Gistbin) error {
	query := `
        UPDATE gistbins 
        SET title = $1, content = $2, category = $3, expires = $4
        WHERE id = $5
    `

	args := []any{
		gistbin.Title,
		gistbin.Content,
		gistbin.Category,
		gistbin.Expires,
		gistbin.ID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	return nil
}

func (m GistbinModel) Delete(id, user_id int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM gistbins WHERE id = $1 AND user_id = $2`

	result, err := m.DB.ExecContext(ctx, query, id, user_id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}
