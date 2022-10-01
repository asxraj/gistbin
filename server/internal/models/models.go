package models

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Gistbins interface {
		Insert(gistbin *Gistbin) error
		Get(id int64) (*Gistbin, error)
		GetAll(id int64) ([]*Gistbin, error)
		Update(gistbin *Gistbin) error
		Delete(id, user_id int64) error
	}

	Users interface {
		Insert(user *User) error
		GetUserByEmail(user *User) error
		GetUserByID(id int64) (*User, error)
	}
}

func NewModels(db *sql.DB) Models {
	return Models{
		Gistbins: GistbinModel{DB: db},
		Users:    UserModel{DB: db},
	}
}
