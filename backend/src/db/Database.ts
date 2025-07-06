import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Usar 'open' para usar async/await
export const openDb = async () => {
    return open({
        filename: path.resolve(__dirname, '../../data/database.sqlite'),
        driver: sqlite3.Database
    });
}

export const initDb = async () => {
    const db = await openDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS registers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      name TEXT NOT NULL,
      value REAL NOT NULL,
      date TEXT NOT NULL,
      registerType TEXT NOT NULL CHECK(registerType IN ('credit', 'debit'))
    )
  `);
}
