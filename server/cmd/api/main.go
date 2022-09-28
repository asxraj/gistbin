package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/asxraj/gistbin/internal/models"

	_ "github.com/lib/pq"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
	dsn  string
	jwt  struct {
		secret string
	}
}

type application struct {
	config   config
	models   models.Models
	infoLog  *log.Logger
	errorLog *log.Logger
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "Server listens to port")
	flag.StringVar(&cfg.env, "env", "development", "development|production|staging")
	flag.StringVar(&cfg.dsn, "dsn", "", "postgresql data source name")
	flag.StringVar(&cfg.jwt.secret, "jwt-secret", "", "jwt secret")

	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	db, err := openDB(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	infoLog.Println("database connection pool established")

	app := &application{
		config:   cfg,
		models:   models.NewModels(db),
		infoLog:  infoLog,
		errorLog: errorLog,
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	infoLog.Println("Starting up server at port:", srv.Addr)
	err = srv.ListenAndServe()
	errorLog.Fatal(err)
}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil

}
