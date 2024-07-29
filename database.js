import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DB_NAME = "diary_test.db";

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS diary (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          date DATE NOT NULL,
          rawInput TEXT NOT NULL,
          content TEXT,
          imgUrl VARCHAR(255),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
`);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const addEntry = async (date, text) => {
  if (!db) await initDatabase();
  try {
    const result = await db.runAsync(
      "INSERT INTO diary (userId, date, rawInput) VALUES (?, ?, ?)",
      1,
      date,
      text
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
};

export const updateEntry = async (id, text) => {
  if (!db) await initDatabase();
  try {
    await db.execAsync("UPDATE diary SET text = ? WHERE id = ?;", [text, id]);
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

export const deleteEntry = async (id) => {
  if (!db) await initDatabase();
  try {
    const result = await db.runAsync("DELETE FROM diary WHERE id = $id", {
      $id: id,
    });
    return result;
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
};

export const getEntries = async () => {
  if (!db) await initDatabase();
  try {
    const result = await db.getAllAsync("SELECT * FROM diary;");
    return result;
  } catch (error) {
    console.error("Error getting entries:", error);
    return []; // Return an empty array in case of error
  }
};

export const getEntryByDate = async (date) => {
  if (!db) await initDatabase();
  try {
    const result = await db.execAsync("SELECT * FROM diary WHERE date = ?;", [
      date,
    ]);
    return result[0].rows[0] || null; // Return null if no entry is found
  } catch (error) {
    console.error("Error getting entry by date:", error);
    return null; // Return null in case of error
  }
};
