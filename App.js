import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screens from "./navigation/screens";
import firebase from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0s20tQdc4bDanUJlii-6tlUna8FqdH78",
  authDomain: "cityemergency-4f19d.firebaseapp.com",
  projectId: "cityemergency-4f19d",
  storageBucket: "cityemergency-4f19d.appspot.com",
  messagingSenderId: "772955228732",
  appId: "1:772955228732:web:aec96641a2b4051a1dd139",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Screens />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
