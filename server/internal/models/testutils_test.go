package models

import (
	"database/sql"
	"os"
	"strings"
	"testing"

	_ "github.com/lib/pq"
)

func newTestDB(t *testing.T) *sql.DB {

	db, err := sql.Open("postgres", "postgres://test_gistbin:pa55word@localhost/test_gistbins?sslmode=disable")
	if err != nil {
		t.Fatal(err)
	}

	script, err := os.ReadFile("./testdata/setup.sql")
	if err != nil {
		t.Fatal(err)
	}

	stmts := strings.Split(string(script), ";")

	for _, stmt := range stmts {
		_, err = db.Exec(stmt)
		if err != nil {
			t.Fatal(err)
		}
	}

	t.Cleanup(func() {
		script, err := os.ReadFile("./testdata/teardown.sql")
		if err != nil {
			t.Fatal(err)
		}
		_, err = db.Exec(string(script))
		if err != nil {
			t.Fatal(err)
		}
		db.Close()
	})

	return db

}
