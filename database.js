import * as SQLite from "expo-sqlite";

let db = null;

export const initDatabase = async () => {
  if (db !== null) {
    return;
  }

  try {
    db = await SQLite.openDatabaseAsync("diary.db");
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, text TEXT);"
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const addEntry = async (date, text) => {
  if (!db) await initDatabase();
  try {
    const result = await db.execAsync(
      "INSERT INTO entries (date, text) VALUES (?, ?);",
      [date, text]
    );
    return result[0].insertId;
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
};

export const updateEntry = async (id, text) => {
  if (!db) await initDatabase();
  try {
    await db.execAsync("UPDATE entries SET text = ? WHERE id = ?;", [text, id]);
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

export const deleteEntry = async (id) => {
  if (!db) await initDatabase();
  try {
    await db.execAsync("DELETE FROM entries WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
};

export const getEntries = async () => {
  if (!db) await initDatabase();
  try {
    const result = await db.execAsync(
      "SELECT * FROM entries ORDER BY date DESC;"
    );
    return result && result[0] && result[0].rows ? result[0].rows : [];
  } catch (error) {
    console.error("Error getting entries:", error);
    return []; // Return an empty array in case of error
  }
};

export const getEntryByDate = async (date) => {
  if (!db) await initDatabase();
  try {
    const result = await db.execAsync("SELECT * FROM entries WHERE date = ?;", [
      date,
    ]);
    return result[0].rows[0] || null; // Return null if no entry is found
  } catch (error) {
    console.error("Error getting entry by date:", error);
    return null; // Return null in case of error
  }
};
