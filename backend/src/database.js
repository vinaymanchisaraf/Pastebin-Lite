const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(
            path.join(__dirname, '..', 'database.sqlite'),
            (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                } else {
                    console.log('Connected to SQLite database');
                    this.initTables();
                }
            }
        );
    }

    initTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS pastes (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                ttl_seconds INTEGER,
                expires_at INTEGER,
                max_views INTEGER,
                view_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT 1
            )
        `);
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = new Database();