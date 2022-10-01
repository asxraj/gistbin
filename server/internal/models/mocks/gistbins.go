package mocks

import (
	"time"

	"github.com/asxraj/gistbin/internal/models"
)

var mockGistbin = &models.Gistbin{
	ID:        1,
	Title:     "mocks.go",
	Content:   "This is the gistbin mock",
	Category:  "Coding",
	CreatedAt: time.Now(),
	Expires:   time.Now(),
}

var mostTobeInsertedGistbin = &models.Gistbin{
	ID:        1,
	Title:     "test.go",
	Content:   "to be inserted",
	Category:  "Coding",
	CreatedAt: time.Now(),
	Expires:   time.Now(),
}

type GistbinModel struct{}

func (m GistbinModel) Insert(gistbin *models.Gistbin) error {
	return nil
}

func (m GistbinModel) Get(id int64) (*models.Gistbin, error) {
	switch id {
	case 1:
		return mockGistbin, nil
	default:
		return nil, models.ErrRecordNotFound
	}
}

func (m GistbinModel) GetAll(id int64) ([]*models.Gistbin, error) {
	return nil, nil
}

func (m GistbinModel) Update(gistbin *models.Gistbin) error {
	return nil
}

func (m GistbinModel) Delete(id, user_id int64) error {
	return nil
}
