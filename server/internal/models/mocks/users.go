package mocks

import (
	"github.com/asxraj/gistbin/internal/models"
)

type UserModel struct{}

func (m UserModel) Insert(user *models.User) error {
	switch user.Email {
	case "duplication@example.com":
		return models.ErrDuplicateEmail
	default:
		return nil
	}
}

func (m UserModel) GetUserByEmail(user *models.User) error {
	return nil
}

func (m UserModel) GetUserByID(id int64) (*models.User, error) {
	return nil, nil
}
