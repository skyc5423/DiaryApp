import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addEntry } from "../database";

const COLORS = {
  primary: "#7BB5B5",
  secondary: "#F0F7F4",
  text: "#2C3E50",
  accent: "#93A9D1",
};

const API_URL_WRITE_DIARY = "http://54.180.131.3:8000/diaries";

export default function WriteDiaryScreen() {
  const [keyword, setKeyword] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [celebrationImage, setCelebrationImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (keyword.trim() === "") {
      Alert.alert("Error", "Please write something in your diary.");
      return;
    }

    setIsLoading(true);

    try {
      // Format the selected date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const requestBody = {
        userId: 1, // Replace with actual user ID
        date: formattedDate,
        rawInput: keyword,
      };

      const response = await fetch(API_URL_WRITE_DIARY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const responseText = responseData.content;

      await addEntry(formattedDate, keyword, responseText);

      setDiaryEntry(responseText);
    } catch (error) {
      console.error("Error saving diary entry:", error);
      Alert.alert(
        "Error",
        "Failed to save your diary entry. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetEntry = () => {
    setKeyword("");
    setDiaryEntry("");
    setCelebrationImage(null);
    setSelectedDate(new Date());
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Creating your diary entry...</Text>
          </View>
        ) : diaryEntry ? (
          <View style={styles.resultContainer}>
            <Text style={styles.diaryText}>{diaryEntry}</Text>
            {celebrationImage && (
              <Image source={{ uri: celebrationImage }} style={styles.image} />
            )}
            <TouchableOpacity style={styles.button} onPress={resetEntry}>
              <Text style={styles.buttonText}>Write Another Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.prompt}>What's on your mind?</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <TextInput
              style={styles.input}
              onChangeText={setKeyword}
              value={keyword}
              placeholder="Enter a keyword for your diary"
              placeholderTextColor={COLORS.text + "80"}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Write Diary</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  prompt: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: COLORS.text,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
  },
  diaryText: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
    color: COLORS.text,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 75,
  },
});
