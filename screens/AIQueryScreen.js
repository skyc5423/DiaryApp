// screens/AIQueryScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL_RAG = "http://54.180.131.3:8000/rag";

const COLORS = {
  primary: "#7BB5B5",
  secondary: "#F0F7F4",
  text: "#2C3E50",
  accent: "#93A9D1",
  danger: "#E74C3C",
};

const QAItem = ({ item, onToggle, isExpanded }) => (
  <View style={styles.qaItemContainer}>
    <TouchableOpacity onPress={onToggle} style={styles.questionContainer}>
      <Text
        style={styles.questionText}
        numberOfLines={isExpanded ? undefined : 2}
      >
        Q: {item.query}
      </Text>
      <Ionicons
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={24}
        color={COLORS.accent}
      />
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.answerContainer}>
        <Text style={styles.answerText}>A: {item.answer}</Text>
      </View>
    )}
  </View>
);

const QAScreen = () => {
  const [query, setQuery] = useState("");
  const [qaList, setQAList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Load past Q&As from local storage or database
    loadPastQAs();
  }, []);

  const loadPastQAs = async () => {
    // TODO: Implement loading from local storage or database
    // For now, we'll use mock data
    setQAList([
      {
        id: 1,
        query: "What is React Native?",
        answer: "React Native is a mobile app development framework...",
      },
      {
        id: 2,
        query: "How to use useState?",
        answer:
          "useState is a React hook that lets you add state to functional components...",
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a query");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL_RAG, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // TODO: Replace with actual user ID
          query: query.trim(),
        }),
      });

      const newQA = {
        id: Date.now(), // Use a proper ID in production
        query: query.trim(),
        answer: response.data.answer,
      };

      setQAList((prevList) => [newQA, ...prevList]);
      setExpandedId(newQA.id);
      setQuery("");
      Alert.alert("Response", response.data.answer);

      // TODO: Save the new Q&A to local storage or database
    } catch (error) {
      console.error("Error submitting query:", error);
      Alert.alert("Error", "Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderQAItem = ({ item }) => (
    <QAItem
      item={item}
      onToggle={() => toggleExpand(item.id)}
      isExpanded={expandedId === item.id}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust this value as needed
    >
      <FlatList
        data={qaList}
        renderItem={renderQAItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Enter your query here"
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  container: {
    flex: 1,
    paddingTop: 40, // Increased top padding
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 10, // Adjusted for the increased top padding in container
  },
  inputOuterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: COLORS.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25, // Rounded corners
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    paddingRight: 10,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  qaItemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.primary,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  answerContainer: {
    padding: 15,
  },
  answerText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
});

export default QAScreen;
