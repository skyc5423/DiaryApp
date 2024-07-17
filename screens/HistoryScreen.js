import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons

const COLORS = {
  primary: "#7BB5B5", // Soft teal
  secondary: "#F0F7F4", // Light mint cream
  text: "#2C3E50", // Dark blue-gray
  accent: "#93A9D1", // Soft periwinkle
  danger: "#E74C3C", // Soft red for delete
};

// Mock data for diary entries
const mockEntries = {
  "2023-07-12": {
    text: "Today was a great day! I felt happy and accomplished.",
    image: "https://example.com/images/happy.jpg",
  },
  "2023-07-11": {
    text: "I had a challenging day, but I learned a lot from it.",
    image: "https://example.com/images/challenge.jpg",
  },
  "2023-07-10": {
    text: "Spent time with family. Feeling grateful and loved.",
    image: "https://example.com/images/family.jpg",
  },
  "2023-07-09": {
    text: "Explored a new hobby. It's exciting to learn something new!",
    image: "https://example.com/images/hobby.jpg",
  },
  "2023-07-08": {
    text: "Reflected on my goals. Feeling motivated and focused.",
    image: "https://example.com/images/goals.jpg",
  },
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState(mockEntries);
  const [selectedDate, setSelectedDate] = useState(Object.keys(entries)[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const dates = Object.keys(entries).sort().reverse();

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(entries).forEach((date) => {
      if (date === selectedDate) {
        markedDates[date] = {
          selected: true,
          selectedColor: COLORS.primary,
          marked: true,
          dotColor: "white",
        };
      } else {
        markedDates[date] = { marked: true, dotColor: COLORS.primary };
      }
    });
    return markedDates;
  };

  const goToPreviousEntry = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1]);
      setIsEditing(false);
    }
  };

  const goToNextEntry = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(entries[selectedDate].text);
    setShowMenu(false);
  };

  const handleSave = () => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [selectedDate]: { ...prevEntries[selectedDate], text: editedText },
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setEntries((prevEntries) => {
      const newEntries = { ...prevEntries };
      delete newEntries[selectedDate];
      setSelectedDate(Object.keys(newEntries)[0]);
      return newEntries;
    });
    setShowMenu(false);
  };

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
          markedDates={getMarkedDates()}
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

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            !dates[dates.indexOf(selectedDate) + 1] && styles.disabledButton,
          ]}
          onPress={goToPreviousEntry}
          disabled={!dates[dates.indexOf(selectedDate) + 1]}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            !dates[dates.indexOf(selectedDate) - 1] && styles.disabledButton,
          ]}
          onPress={goToNextEntry}
          disabled={!dates[dates.indexOf(selectedDate) - 1]}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
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
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.accent + "80", // Add transparency to show it's disabled
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
