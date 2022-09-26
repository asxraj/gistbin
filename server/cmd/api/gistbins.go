package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/asxraj/gistbin/internal/models"
	"github.com/asxraj/gistbin/internal/validator"
	"github.com/julienschmidt/httprouter"
)

func (app *application) createGistbin(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		Category string `json:"category"`
		Expires  string `json:"expires"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	minutes, err := strconv.Atoi(input.Expires)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	expires := time.Now().Add(time.Duration(minutes) * time.Minute)

	gistbin := &models.Gistbin{
		Title:    input.Title,
		Content:  input.Content,
		Category: input.Category,
		Expires:  expires,
	}

	v := validator.New()

	if models.ValidateGistbin(v, gistbin); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Gistbins.Insert(gistbin)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/movies/%d", gistbin.ID))

	err = app.writeJSON(w, http.StatusCreated, wrapper{"gistbin": gistbin}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) viewGistbin(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context()).ByName("id")
	id, err := strconv.ParseInt(params, 10, 64)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	gistbin, err := app.models.Gistbins.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, models.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, wrapper{"gistbin": gistbin}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
