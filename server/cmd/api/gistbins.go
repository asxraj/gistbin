package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/asxraj/gistbin/internal/models"
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
		app.errorLog.Println(err)
		return
	}

	minutes, err := strconv.Atoi(input.Expires)
	if err != nil {
		app.errorLog.Println(err)
		return
	}
	expires := time.Now().Add(time.Duration(minutes) * time.Minute)

	gistbin := &models.Gistbin{
		Title:    input.Title,
		Content:  input.Content,
		Category: input.Category,
		Expires:  expires,
	}

	id, err := app.models.Gistbins.Insert(gistbin)
	if err != nil {
		app.errorLog.Println(err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, wrapper{"response": "ok", "id": id}, nil)
	if err != nil {
		app.errorLog.Println(err)

	}

}

func (app *application) viewGistbin(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context()).ByName("id")

	id, err := strconv.ParseInt(params, 10, 64)
	if err != nil {
		app.errorLog.Println(err)
		return
	}

	gistbin, err := app.models.Gistbins.Get(id)
	if err != nil {
		app.errorLog.Println(err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, wrapper{"gistbin": gistbin}, nil)
	if err != nil {
		app.errorLog.Println(err)
	}

}
