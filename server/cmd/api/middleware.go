package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/asxraj/gistbin/internal/models"
	"github.com/cristalhq/jwt/v4"
)

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE, POST, PATCH, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		next.ServeHTTP(w, r)
	})
}

func (app *application) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Add("Vary", "Authorization")

		authorizationHeader := r.Header.Get("Authorization")

		if authorizationHeader == "" {
			r = app.contextSetUser(r, models.AnonymousUser)
			next.ServeHTTP(w, r)
			return
		}

		headerPars := strings.Split(authorizationHeader, " ")
		if len(headerPars) != 2 || headerPars[0] != "Bearer" {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}

		token := headerPars[1]

		key := []byte(app.config.jwt.secret)
		verifier, err := jwt.NewVerifierHS(jwt.HS256, key)
		if err != nil {
			app.notPermittedResponse(w, r)
			return
		}

		newToken, err := jwt.Parse([]byte(token), verifier)
		if err != nil {
			app.notPermittedResponse(w, r)
			return
		}

		err = verifier.Verify(newToken)
		if err != nil {
			app.notPermittedResponse(w, r)
			return
		}

		var newClaims jwt.RegisteredClaims
		errClaims := json.Unmarshal(newToken.Claims(), &newClaims)
		if errClaims != nil {
			app.notPermittedResponse(w, r)
			return
		}

		errParseClaims := jwt.ParseClaims([]byte(token), verifier, &newClaims)
		if errParseClaims != nil {
			app.notPermittedResponse(w, r)
			return
		}

		var valid bool = newClaims.IsValidAt(time.Now())
		if !valid {
			app.errorResponseJSON(w, r, http.StatusForbidden, wrapper{"error": "the token is not valid anymore"})
			return
		}

		id, err := strconv.ParseInt(newClaims.Subject, 10, 64)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		user, err := app.models.Users.GetUserByID(id)
		if err != nil {
			switch {
			case errors.Is(err, models.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

		r = app.contextSetUser(r, user)

		next.ServeHTTP(w, r)

	})

}

func (app *application) requireAuthenticatedUser(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := app.contextGetUser(r)

		if user.IsAnonymous() {
			app.authenticationRequiredResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}
