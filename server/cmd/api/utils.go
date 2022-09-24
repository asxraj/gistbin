package main

import (
	"encoding/json"
	"net/http"
)

type wrapper map[string]any

func (app *application) writeJSON(w http.ResponseWriter, status int, data wrapper, headers http.Header) error {
	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	for key, value := range headers {
		w.Header()[key] = value
	}

	js = append(js, '\n')

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}
