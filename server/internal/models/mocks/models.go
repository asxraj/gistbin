package mocks

import "github.com/asxraj/gistbin/internal/models"

func NewModels() models.Models {
	return models.Models{
		Gistbins: GistbinModel{},
		Users:    UserModel{},
	}
}
