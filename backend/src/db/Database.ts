import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const openDb = async (databasePath: string) => {
    return open({
        filename: databasePath,
        driver: sqlite3.Database
    });
}
export const initDb = async (databasePath: string) => {
    const db = await openDb(databasePath);
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
