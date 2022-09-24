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

func (m GistbinModel) Insert(gistbin *Gistbin) error {
	query := `
        INSERT INTO gistbins (title, content, category, expires)
        VALUES ($1, $2, $3, $4) 
    `

	args := []any{gistbin.Title, gistbin.Content, gistbin.Category, gistbin.Expires}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}

	return nil
}

func (m GistbinModel) Delete() error {
	return nil
}
