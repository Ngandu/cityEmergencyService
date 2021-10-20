import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { observer } from "mobx-react-lite";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Modal,
  Input,
  Icon,
} from "@ui-kitten/components";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { registration, registerWithGoogle } from "./../sdk/FirebaseMethods";

import Styles from "../Styles";

const Signup = observer(({ userstore }) => {
  const [visible, setVisible] = useState(false);
  const windowHeight = Dimensions.get("screen").height;
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordrpt, setPasswordrpt] = useState("");
  const [firstname, setFirstname] = useState("");
  const [secondname, setSecondname] = useState("");
  const [cellphone, setCellphone] = useState("");

  useEffect(() => {
    // Fetch Products
    console.log("Home");
  }, []);

  const emptyState = () => {
    setFirstname("");
    setSecondname("");
    setEmail("");
    setPassword("");
    setPasswordrpt("");
    setCellphone("");
  };

  const handleRegistration = async () => {
    if (!firstname) {
      Alert.alert("First name is required");
    } else if (!secondname) {
      Alert.alert("Second name field is required.");
    } else if (!email) {
      Alert.alert("Email field is required.");
    } else if (!password) {
      Alert.alert("Password field is required.");
    } else if (!passwordrpt) {
      setPassword("");
      Alert.alert("Confirm password field is required.");
    } else if (!cellphone) {
      Alert.alert("Ccellphone field is required.");
    } else if (password !== passwordrpt) {
      Alert.alert("Password does not match!");
    } else {
      registration(email, password, secondname, firstname, cellphone);
      // navigation.navigate("Loading");
      await firebase.auth().onAuthStateChanged((user) => {
        //setLoading(false);
        console.log("user -", user);
        if (user) {
          emptyState();
          // Update Mobx User and Login
          console.log("setUser");
          userstore.setUser(user);
          //navigation.replace("Home");
        }
      });
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{ fex: 1, height: "100%" }}
    >
      <ScrollView>
        <View>
          <ApplicationProvider {...eva} theme={eva.light}>
            <View style={Styles.authFormContainer}>
              <Text category="h3" style={Styles.authHeader}>
                New Account
              </Text>
              <Input
                size="large"
                placeholder="First Name"
                style={Styles.authInput}
                onChangeText={(txt) => setFirstname(txt)}
              />
              <Input
                size="large"
                placeholder="Last Name"
                style={Styles.authInput}
                onChangeText={(txt) => setSecondname(txt)}
              />
              <Input
                size="large"
                placeholder="Cellphone"
                style={Styles.authInput}
                onChangeText={(txt) => setCellphone(txt)}
              />
              <Input
                size="large"
                placeholder="Email"
                style={Styles.authInput}
                onChangeText={(txt) => setEmail(txt)}
              />
              <Input
                size="large"
                placeholder="Password"
                style={Styles.authInput}
                onChangeText={(txt) => setPassword(txt)}
                secureTextEntry={true}
              />
              <Input
                size="large"
                placeholder="Repeat Password"
                style={Styles.authInput}
                onChangeText={(txt) => setPasswordrpt(txt)}
                secureTextEntry={true}
              />
              <Button
                style={Styles.authButton}
                onPress={() => handleRegistration()}
              >
                SIGNUP
              </Button>
              <Button style={Styles.authGoogleButton}>
                <FontAwesome5 name="google" size={14} color="white" /> Sign in
                with Google
              </Button>
              <Button
                appearance="ghost"
                status="basic"
                onPress={() => navigation.navigate("SignIn")}
              >
                Already have an account? singin.
              </Button>
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Signup;
