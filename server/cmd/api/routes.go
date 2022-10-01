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

	// Gistbin handlers
	router.HandlerFunc(http.MethodPost, "/v1/gistbin/create", app.createGistbin)
	router.HandlerFunc(http.MethodGet, "/v1/gistbin/:id", app.viewGistbin)
	router.HandlerFunc(http.MethodGet, "/v1/gistbins", app.getMyGistbins)
	router.HandlerFunc(http.MethodPatch, "/v1/gistbin/edit/:id", app.requireAuthenticatedUser(app.updateGistbin))
	router.HandlerFunc(http.MethodDelete, "/v1/gistbin/delete/:id", app.requireAuthenticatedUser(app.deleteGistbin))

	// User handlers
	router.HandlerFunc(http.MethodPost, "/v1/users/create", app.createUser)
	router.HandlerFunc(http.MethodPost, "/v1/users/login", app.loginUser)

	return app.enableCORS(app.authenticate(router))
}
