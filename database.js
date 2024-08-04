import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DB_NAME = "diary_test.db";

let db = null;

const API_URL_QUERY_ALL_DIARIES = "http://54.180.131.3:8000/users";

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    console.log("Database opened");

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
      );`);
    syncDatabase();
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const addEntry = async (date, rawInput, text) => {
  if (!db) await initDatabase();
  try {
    console.log("Adding entry:", date, rawInput, text);
    const result = await db.runAsync(
      "INSERT INTO diary (userId, date, rawInput, content) VALUES (?, ?, ?, ?)",
      1,
      date,
      rawInput,
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
    console.log("Getting all entries");
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
    console.log("Getting entry by date:", date);
    const result = await db.getAllAsync(
      "SELECT * FROM diary WHERE date = $date;",
      {
        $date: date,
      }
    );

    if (Array.isArray(result) && result.length > 0) {
      if (Array.isArray(result[0].rows) && result[0].rows.length > 0) {
        console.log("Entry found:", result[0].rows[0]);
        return result[0].rows[0];
      }
    }
    console.log("No entry found for date:", date);

    return null; // Return null if no entry is found
  } catch (error) {
    console.error("Error getting entry by date:", error);
    return null; // Return null in case of error
  }
};

export const syncDatabase = async (data) => {
  if (!db) await initDatabase();
  try {
    const response = await fetch(`${API_URL_QUERY_ALL_DIARIES}/${1}/diaries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      console.log(data);

      data.forEach(async (diary) => {
        const existingEntry = await getEntryByDate(diary.date);
        console.log("Existing entry:", existingEntry);
        if (existingEntry === null) {
          console.log(
            "No existing entry:",
            diary.date,
            diary.rawInput,
            diary.content
          );
          addEntry(diary.date, diary.rawInput, diary.content);
        }
      });
    }

    return true;
  } catch (error) {
    return false;
  }
};
