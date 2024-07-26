// screens/WriteDiaryScreen.js
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

import { addEntry } from "../database";

const COLORS = {
  primary: "#7BB5B5", // Soft teal
  secondary: "#F0F7F4", // Light mint cream
  text: "#2C3E50", // Dark blue-gray
  accent: "#93A9D1", // Soft periwinkle
};

const API_URL = "http://54.180.131.3:8000/ping";

export default function WriteDiaryScreen() {
  const [keyword, setKeyword] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [celebrationImage, setCelebrationImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (keyword.trim() === "") {
      Alert.alert("Error", "Please write something in your diary.");
      return;
    }

    setIsLoading(true);

    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Prepare the request body
      const requestBody = {
        userId: 1, // Replace with actual user ID
        date: currentDate,
        rawInput: keyword,
      };

      // Make the API call
      const response = await fetch(API_URL, {
        method: "GET",
        // headers: {
        // "Content-Type": "application/json",
        // },
        // body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      const responseText = JSON.stringify(responseData);

      await addEntry(currentDate, responseText);

      Alert.alert("Success", "Your diary entry has been saved.");
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
            <Text style={styles.prompt}>What's on your mind today?</Text>
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
