package models

import "database/sql"

type Models struct {
	Gistbins GistbinModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Gistbins: GistbinModel{DB: db},
	}
}
