package models

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type Gistbin struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
	Expires   time.Time `json:"expires"`
}

type GistbinModel struct {
	DB *sql.DB
}

func (m GistbinModel) Insert(gistbin *Gistbin) error {
	query := `
        INSERT INTO gistbins (title, content, category, expires)
        VALUES ($1, $2, $3, $4) 
        RETURNING id, created_at, expires
    `

	args := []any{gistbin.Title, gistbin.Content, gistbin.Category, gistbin.Expires}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRowContext(ctx, query, args...).Scan(&gistbin.ID, &gistbin.CreatedAt, &gistbin.Expires)
}

func (m GistbinModel) Get(id int64) (*Gistbin, error) {
	query := "SELECT title, content, category, created_at, expires FROM gistbins WHERE id = $1 AND now() < expires"

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gistbin Gistbin

	err := m.DB.QueryRowContext(ctx, query, id).Scan(&gistbin.Title, &gistbin.Content, &gistbin.Category, &gistbin.CreatedAt, &gistbin.Expires)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &gistbin, nil
}
