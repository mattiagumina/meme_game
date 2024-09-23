import sqlite from 'sqlite3';

// open the database
export const db = new sqlite.Database('./db/db.sqlite', (err) => {
  if (err) throw err;
});