package main

import (
	"net/http"
	"testing"

	"github.com/asxraj/gistbin/internal/assert"
)

func TestHealthCheckHandler(t *testing.T) {

	app := newTestApplication(t)

	ts := newTestServer(t, app.routes())
	defer ts.Close()

	code, _, _ := ts.get(t, "/v1/healthcheck")

	assert.Equal(t, code, http.StatusOK)
}
