import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";

export default function WriteDiaryScreen() {
  const [keyword, setKeyword] = useState("");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [celebrationImage, setCelebrationImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (keyword.trim() === "") {
      alert("Please enter a keyword for your diary.");
      return;
    }

    setIsLoading(true);

    // Simulating API call with a delay
    setTimeout(() => {
      // TODO: Replace with actual API call
      setDiaryEntry(`Today was a great day! I felt ${keyword}.`);
      setCelebrationImage("https://via.placeholder.com/150");
      setIsLoading(false);
    }, 2000); // 2-second delay to simulate API call
  };

  const resetEntry = () => {
    setKeyword("");
    setDiaryEntry("");
    setCelebrationImage(null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Creating your diary entry...</Text>
      </View>
    );
  }

  if (diaryEntry) {
    return (
      <View style={styles.container}>
        <Text style={styles.diaryText}>{diaryEntry}</Text>
        {celebrationImage && (
          <Image source={{ uri: celebrationImage }} style={styles.image} />
        )}
        <TouchableOpacity style={styles.button} onPress={resetEntry}>
          <Text style={styles.buttonText}>Write Another Entry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setKeyword}
        value={keyword}
        placeholder="Enter a keyword for your diary"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Write Diary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  diaryText: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    alignSelf: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});
