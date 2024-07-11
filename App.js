import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  const [greeting, setGreeting] = useState("Hello, World!");

  const changeGreeting = () => {
    setGreeting("Hello, React Native!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{greeting}</Text>
      <TouchableOpacity style={styles.button} onPress={changeGreeting}>
        <Text style={styles.buttonText}>Change Greeting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
