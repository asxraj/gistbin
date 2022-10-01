package main

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/asxraj/gistbin/internal/assert"
)

func TestEnableCORS(t *testing.T) {
	// Initialize a new responserecorded
	rr := httptest.NewRecorder()

	// Initialize dummy request
	r, err := http.NewRequest(http.MethodGet, "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a mock HTTP handler that we can pass to our enableCORS
	// middleware, which writes a 200 status code and an "OK" response body.
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Create app struct to access handlers
	app := application{}

	// Pass the mock HTTP handler to our enableCORS middleware. Because enableCORS returns a http.Handler we can call its ServeHTTP() method, passing in the http.ResponseRecorder and dummy http.Request to execute it.
	app.enableCORS(next).ServeHTTP(rr, r)

	rs := rr.Result()

	// Check that middleware set the Access-Control-Allow-Methods header to its response
	expectedValue := "DELETE, POST, PATCH, GET, OPTIONS"
	assert.Equal(t, rs.Header.Get("Access-Control-Allow-Methods"), expectedValue)

	// Check that middleware set the Access-Control-Allow-Headers header to its response
	expectedValue = "Content-Type, Authorization"
	assert.Equal(t, rs.Header.Get("Access-Control-Allow-Headers"), expectedValue)

	assert.Equal(t, rs.StatusCode, http.StatusOK)

	defer rs.Body.Close()
	body, err := io.ReadAll(rs.Body)
	if err != nil {
		t.Fatal(err)
	}
	bytes.TrimSpace(body)

	assert.Equal(t, string(body), "OK")
}
