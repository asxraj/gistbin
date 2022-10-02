package main

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/asxraj/gistbin/internal/assert"
)

func TestCreateUser(t *testing.T) {
	app := newTestApplication(t)

	ts := newTestServer(t, app.routes())
	defer ts.Close()

	type input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	tests := []struct {
		name     string
		wantCode int
		input    input
	}{

		{
			name:     "Valid Input",
			wantCode: http.StatusCreated,
			input: input{
				Username: "asxraj",
				Email:    "asxraj@gmail.com",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - Duplicate Email",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Username: "asxraj",
				Email:    "duplicate@example.com",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - Empty Username",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Username: "",
				Email:    "asxraj@gmail.com",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - Empty Email",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Username: "asxraj",
				Email:    "",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - No Password",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Username: "",
				Email:    "asxraj@gmail.com",
				Password: "",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonInput, err := json.Marshal(tt.input)
			if err != nil {
				t.Fatal(err)
			}

			code, _, _ := ts.post(t, "/v1/users/create", jsonInput)

			assert.Equal(t, code, tt.wantCode)

		})
	}

}

func TestLoginUser(t *testing.T) {
	app := newTestApplication(t)

	ts := newTestServer(t, app.routes())

	type input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	tests := []struct {
		name     string
		wantCode int
		input    input
	}{
		{
			name:     "Valid User",
			wantCode: http.StatusOK,
			input: input{
				Email:    "asxraj@gmail.com",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid User Credentials - Wrong Password",
			wantCode: http.StatusUnauthorized,
			input: input{
				Email:    "asxraj@gmail.com",
				Password: "pa55wod11",
			},
		},
		{
			name:     "Invalid User Credentials - Have Not Signed Up",
			wantCode: http.StatusUnauthorized,
			input: input{
				Email:    "invalid@example.com",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - Empty Email",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Email:    "",
				Password: "pa55word",
			},
		},
		{
			name:     "Invalid Input - Empty Password",
			wantCode: http.StatusUnprocessableEntity,
			input: input{
				Email:    "",
				Password: "pa55word",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonInput, err := json.Marshal(tt.input)
			if err != nil {
				t.Fatal(err)
			}

			code, _, _ := ts.post(t, "/v1/users/login", jsonInput)

			assert.Equal(t, code, tt.wantCode)
		})
	}
}
