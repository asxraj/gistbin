package main

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/asxraj/gistbin/internal/models/mocks"
	"github.com/joho/godotenv"
)

func newTestApplication(t *testing.T) *application {
	var cfg config
	godotenv.Load("../../.env")
	cfg.jwt.secret = os.Getenv("JWT_SECRET")

	return &application{
		models: mocks.NewModels(),
		config: cfg,
	}
}

type testServer struct {
	*httptest.Server
}

func newTestServer(t *testing.T, h http.Handler) *testServer {
	ts := httptest.NewServer(h)
	return &testServer{ts}
}

func (ts *testServer) get(t *testing.T, urlPath string) (int, http.Header, string) {
	rs, err := ts.Client().Get(ts.URL + urlPath)
	if err != nil {
		t.Fatal(err)
	}
	defer rs.Body.Close()

	body, err := io.ReadAll(rs.Body)
	if err != nil {
		t.Fatal(err)
	}
	bytes.TrimSpace(body)

	return rs.StatusCode, rs.Header, string(body)
}

func (ts *testServer) post(t *testing.T, urlPath string, json []byte) (int, http.Header, string) {

	payload := strings.NewReader(string(json))
	rs, err := ts.Client().Post(ts.URL+urlPath, "application/json", payload)
	if err != nil {
		t.Fatal(err)
	}

	defer rs.Body.Close()
	body, err := io.ReadAll(rs.Body)
	if err != nil {
		t.Fatal(err)
	}
	bytes.TrimSpace(body)

	return rs.StatusCode, rs.Header, string(body)

}
