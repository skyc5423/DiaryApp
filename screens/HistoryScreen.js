import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  initDatabase,
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../database";

const COLORS = {
  primary: "#7BB5B5",
  secondary: "#F0F7F4",
  text: "#2C3E50",
  accent: "#93A9D1",
  danger: "#E74C3C",
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedEntries = await getEntries();
      const entriesObject = loadedEntries.reduce((acc, entry) => {
        acc[entry.date] = { id: entry.id, text: entry.rawInput };
        return acc;
      }, {});
      setEntries(entriesObject);
      if (loadedEntries.length > 0 && !selectedDate) {
        setSelectedDate(loadedEntries[0].date);
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
      Alert.alert("Error", "Failed to load diary entries.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      const setupDatabase = async () => {
        try {
          await initDatabase();
          await loadEntries();
        } catch (error) {
          console.error("Database initialization failed:", error);
          Alert.alert(
            "Error",
            "Failed to initialize the database. Please restart the app."
          );
        }
      };
      setupDatabase();

      return () => {
        // Clean up if needed
      };
    }, [loadEntries])
  );

  const handleSave = async () => {
    try {
      if (entries[selectedDate]) {
        await updateEntry(entries[selectedDate].id, editedText);
      } else {
        await addEntry(selectedDate, editedText);
      }
      await loadEntries();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save entry:", error);
      Alert.alert("Error", "Failed to save diary entry.");
    }
  };

  const handleDelete = async () => {
    try {
      if (entries[selectedDate]) {
        await deleteEntry(entries[selectedDate].id);
        await loadEntries();
      }
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete entry:", error);
      Alert.alert("Error", "Failed to delete diary entry.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(entries[selectedDate]?.text || "");
    setShowMenu(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.calendarButtonText}>
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          current={selectedDate}
          onDayPress={(day) => {
            if (entries[day.dateString]) {
              setSelectedDate(day.dateString);
              setIsEditing(false);
            }
          }}
          markedDates={Object.keys(entries).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: COLORS.primary };
            if (date === selectedDate) {
              acc[date].selected = true;
              acc[date].selectedColor = COLORS.primary;
            }
            return acc;
          }, {})}
          theme={{
            backgroundColor: COLORS.secondary,
            calendarBackground: COLORS.secondary,
            textSectionTitleColor: COLORS.text,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: "#ffffff",
            todayTextColor: COLORS.primary,
            dayTextColor: COLORS.text,
            textDisabledColor: "#d9e1e8",
            dotColor: COLORS.primary,
            selectedDotColor: "#ffffff",
            arrowColor: COLORS.primary,
            monthTextColor: COLORS.text,
            indicatorColor: COLORS.primary,
          }}
        />
      )}

      <View style={styles.entryContainer}>
        <View style={styles.entryHeader}>
          <Text style={styles.dateText}>{selectedDate}</Text>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            multiline
            value={editedText}
            onChangeText={setEditedText}
          />
        ) : (
          <Text style={styles.entryText}>{entries[selectedDate]?.text}</Text>
        )}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowMenu(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={[styles.menuItemText, styles.deleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 20,
  },
  calendarButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  calendarButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  entryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  entryText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  editInput: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  menuItemText: {
    fontSize: 18,
    color: COLORS.text,
  },
  deleteText: {
    color: COLORS.danger,
  },
});
