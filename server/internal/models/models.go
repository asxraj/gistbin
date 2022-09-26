package models

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
)

type Models struct {
	Gistbins GistbinModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Gistbins: GistbinModel{DB: db},
	}
}
