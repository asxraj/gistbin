package models

import (
	"context"
	"database/sql"
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

func (m GistbinModel) Insert(gistbin *Gistbin) (int64, error) {
	query := `
        INSERT INTO gistbins (title, content, category, expires)
        VALUES ($1, $2, $3, $4) 
        RETURNING id
    `

	args := []any{gistbin.Title, gistbin.Content, gistbin.Category, gistbin.Expires}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var id int64
	_ = m.DB.QueryRowContext(ctx, query, args...).Scan(&id)

	return id, nil
}

func (m GistbinModel) Get(id int64) (*Gistbin, error) {
	query := "SELECT title, content, category, created_at, expires FROM gistbins WHERE id = $1 AND now() < expires"

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gistbin Gistbin
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(&gistbin.Title, &gistbin.Content, &gistbin.Category, &gistbin.CreatedAt, &gistbin.Expires)
	if err != nil {
		return nil, err
	}

	return &gistbin, nil
}
