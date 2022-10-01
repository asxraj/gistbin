package main

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/asxraj/gistbin/internal/assert"
	"github.com/asxraj/gistbin/internal/models"
)

func TestCreatGistbin(t *testing.T) {

	app := newTestApplication(t)

	ts := newTestServer(t, app.routes())
	defer ts.Close()

	type input struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		Category string `json:"category"`
		Expires  string `json:"expires"`
	}

	tests := []struct {
		name     string
		wantCode int
		input    input
	}{
		{
			name:     "Valid Input",
			wantCode: http.StatusCreated,
			input:    input{Title: "test", Content: "testcontent", Category: "Coding", Expires: "10"},
		},
		{
			name:     "Invalid Input - Wrong Category",
			wantCode: http.StatusUnprocessableEntity,
			input:    input{Title: "test", Content: "testcontent", Category: "WOOOD", Expires: "10"},
		},
		{
			name:     "Invalid Input - Empty Title",
			wantCode: http.StatusUnprocessableEntity,
			input:    input{Title: "", Content: "testcontent", Category: "Coding", Expires: "10"},
		},
		{
			name:     "Invalid Input - Empty Content",
			wantCode: http.StatusUnprocessableEntity,
			input:    input{Title: "test", Content: "", Category: "Coding", Expires: "10"},
		},
		{
			name:     "Invalid Input - Expires negative value",
			wantCode: http.StatusUnprocessableEntity,
			input:    input{Title: "test", Content: "testcontent", Category: "Coding", Expires: "-10"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			jsonInput, err := json.Marshal(tt.input)
			if err != nil {
				t.Fatal(err)
			}

			code, _, _ := ts.post(t, "/v1/gistbin/create", jsonInput)

			assert.Equal(t, code, tt.wantCode)

		})
	}
}

func TestViewGistbin(t *testing.T) {
	app := newTestApplication(t)

	ts := newTestServer(t, app.routes())
	defer ts.Close()

	tests := []struct {
		name     string
		urlPath  string
		wantCode int
		wantJson string
	}{
		{
			name:     "Valid ID",
			urlPath:  "/v1/gistbin/1",
			wantCode: http.StatusOK,
			wantJson: "mocks.go",
		},
		{
			name:     "Non-existent ID",
			urlPath:  "/v1/gistbin/4",
			wantCode: http.StatusNotFound,
		},
		{
			name:     "Negative ID",
			urlPath:  "/v1/gistbin/-4",
			wantCode: http.StatusNotFound,
		},
		{
			name:     "String ID",
			urlPath:  "/v1/gistbin/HxH",
			wantCode: http.StatusBadRequest,
		},
		{
			name:     "Empty ID",
			urlPath:  "/v1/gistbin/",
			wantCode: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			code, _, body := ts.get(t, tt.urlPath)

			assert.Equal(t, code, tt.wantCode)

			var jsonResp struct {
				Gistbin models.Gistbin `json:"gistbin"`
			}

			json.Unmarshal([]byte(body), &jsonResp)

			if tt.wantJson != "" {
				assert.Equal(t, jsonResp.Gistbin.Title, "mocks.go")
			}
		})
	}

}
