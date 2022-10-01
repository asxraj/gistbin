package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/asxraj/gistbin/internal/models"
	"github.com/asxraj/gistbin/internal/validator"
	"github.com/cristalhq/jwt/v4"
)

func (app *application) createUser(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &models.User{
		Username: input.Username,
		Email:    input.Email,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	v := validator.New()
	models.ValidateUser(v, user)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Users.Insert(user)
	if err != nil {
		switch {
		case errors.Is(err, models.ErrDuplicateEmail):
			v.AddError("email", "a user with this email address already exists")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, wrapper{"user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) loginUser(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &models.User{
		Email: input.Email,
	}

	user.Password.Set(input.Password)

	v := validator.New()
	models.ValidateEmail(v, user.Email)
	models.ValidatePasswordPlaintext(v, user.Password)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Users.GetUserByEmail(user)
	if err != nil {
		switch {
		case errors.Is(err, models.ErrRecordNotFound):
			app.errorResponseJSON(w, r, http.StatusUnauthorized, map[string]string{"email": "email not found"})
			return
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	authenticated, err := user.Password.Matches(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !authenticated {
		app.errorResponseJSON(w, r, http.StatusUnauthorized, wrapper{"password": "wrong password"})
		return
	}

	key := []byte(app.config.jwt.secret)
	signer, err := jwt.NewSignerHS(jwt.HS256, key)
	if err != nil {
		app.errorResponseJSON(w, r, http.StatusBadRequest, err.Error())
		return
	}

	claims := &jwt.RegisteredClaims{
		Subject:   fmt.Sprint(user.ID),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}

	token, err := jwt.NewBuilder(signer).Build(claims)
	if err != nil {
		app.errorResponseJSON(w, r, http.StatusBadRequest, err.Error())
		return
	}

	err = app.writeJSON(w, http.StatusOK, wrapper{"user": user, "token": token.String()}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
