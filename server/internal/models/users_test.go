package models

import (
	"testing"
)

func TestUserModelGetUserByEmail(t *testing.T) {

	if testing.Short() {
		t.Skip("models: skipping integration test")
	}

	tests := []struct {
		name       string
		email      string
		validEmail bool
	}{
		{
			name:       "Valid Email",
			email:      "asxraj@gmail.com",
			validEmail: true,
		},
		{
			name:       "Valid Email - Case Insensitive",
			email:      "aSXraj@gmAiL.cOm",
			validEmail: true,
		},
		{
			name:       "Invalid Email - Don't Exist",
			email:      "sesame@gmAiL.cOm",
			validEmail: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db := newTestDB(t)

			m := UserModel{db}

			user := User{
				Email: tt.email,
			}

			err := m.GetUserByEmail(&user)

			if tt.validEmail {
				if err != nil {
					t.Errorf("got: %v; expected: nil", err)
				}
			} else {
				if err == nil {
					if err == nil {
						t.Errorf("got: %v; expected: error", err)
					}
				}
			}
		})
	}
}
