package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	// override default httprouter not-found and method not allowed response
	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthCheckHandler)
	router.HandlerFunc(http.MethodPost, "/v1/gistbin/create", app.createGistbin)
	router.HandlerFunc(http.MethodGet, "/v1/gistbin/:id", app.viewGistbin)

	return app.enableCORS(router)
}
