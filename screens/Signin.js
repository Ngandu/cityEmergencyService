import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
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
import * as firebase from "firebase";
import Styles from "../Styles";

import { signInUser } from "./../sdk/FirebaseMethods";

const Signin = observer(({ userstore }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("pngandu@yahoo.com");
  const [password, setPassword] = useState("P@ssword1");

  const db = firebase.firestore();

  useEffect(() => {
    // Fetch Products
    console.log("Signin.js");
  }, []);

  const emptyState = () => {
    setEmail("");
    setPassword("");
  };

  const getProviderDetails = async (usr) => {
    // fetch user provider details
    const providerUser = await db
      .collection("serviceProvider")
      .where("userid", "==", usr.uid)
      .get();

    providerUser.docs.forEach((element) => {
      userstore.setProdiverDetails({ id: element.id, ...element.data() });
    });
  };

  const handleSignin = async () => {
    console.log("handleSignin()");
    setLoading(true);
    if (!email) {
      Alert.alert("Email field is required.");
      setLoading(false);
    } else if (!password) {
      Alert.alert("Password field is required.");
      setLoading(false);
    }

    // Check whether the email is for a service provider

    const userDetails = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    userDetails.forEach((doc) => {
      let dd = doc.data();
      console.log(dd);

      if (dd.type !== "Service") {
        alert("user not permitted");
        return;
      } else {
        const user = signInUser(email, password);
        console.log(user);
        if (user) {
          userstore.setUser(user);
        }
      }
    });
  };

  firebase.auth().onAuthStateChanged((user) => {
    setLoading(false);
    console.log("user -", user);
    if (user) {
      emptyState();
      // Update Mobx User and Login
      console.log("setUser");
      getProviderDetails(user);
      userstore.setUser(user);
      //navigation.replace("Home");
    }
  });

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
                HI
              </Text>
              <Input
                size="large"
                placeholder="Email"
                defaultValue={email}
                onChangeText={(text) => setEmail(text)}
                style={Styles.authInput}
              />
              <Input
                size="large"
                placeholder="Password"
                defaultValue={password}
                onChangeText={(text) => setPassword(text)}
                style={Styles.authInput}
                secureTextEntry={true}
              />
              <Button style={Styles.authButton} onPress={() => handleSignin()}>
                {loading ? (
                  <ActivityIndicator
                    animating={loading}
                    color="white"
                  ></ActivityIndicator>
                ) : (
                  "SIGNIN"
                )}
              </Button>
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Signin;
