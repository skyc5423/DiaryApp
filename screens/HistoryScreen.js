import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";

const COLORS = {
  primary: "#7BB5B5", // Soft teal
  secondary: "#F0F7F4", // Light mint cream
  text: "#2C3E50", // Dark blue-gray
  accent: "#93A9D1", // Soft periwinkle
};

// Mock data for diary entries with images
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
  const [selectedDate, setSelectedDate] = useState(Object.keys(mockEntries)[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const dates = Object.keys(mockEntries).sort().reverse();

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(mockEntries).forEach((date) => {
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
    }
  };

  const goToNextEntry = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
    }
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
            if (mockEntries[day.dateString]) {
              setSelectedDate(day.dateString);
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
        <Text style={styles.dateText}>{selectedDate}</Text>
        <Image
          source={{ uri: mockEntries[selectedDate]?.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.entryText}>{mockEntries[selectedDate]?.text}</Text>
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
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  entryText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
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
});
