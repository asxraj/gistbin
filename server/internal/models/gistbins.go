package models

import "database/sql"

type Gistbin struct {
	Title string
}

type GistbinModel struct {
	DB *sql.DB
}

func (m GistbinModel) Insert() error {
	return nil
}

func (m GistbinModel) Delete() error {
	return nil
}
