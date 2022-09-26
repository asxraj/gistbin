package main

import (
	"fmt"
	"net/http"
)

func (app *application) errorResponseJSON(w http.ResponseWriter, r *http.Request, status int, message any) {

	wrap := wrapper{
		"error": message,
	}

	err := app.writeJSON(w, status, wrap, nil)
	if err != nil {
		app.errorLog.Println(err)
		w.WriteHeader(500)
	}

}

func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.errorLog.Println(r, err)

	message := "the server encountered a problem and could not process your request"
	app.errorResponseJSON(w, r, http.StatusInternalServerError, message)
}

func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	app.errorResponseJSON(w, r, http.StatusNotFound, message)
}

func (app *application) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	message := fmt.Sprintf("the %s method is not supported for this resource", r.Method)
	app.errorResponseJSON(w, r, http.StatusMethodNotAllowed, message)
}

func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.errorResponseJSON(w, r, http.StatusBadRequest, err.Error())
}