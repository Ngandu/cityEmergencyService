import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { observer } from "mobx-react-lite";
import * as Location from "expo-location";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Modal,
  Input,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

import { setProviderActive, getIncedents } from "./../sdk/FirebaseMethods";

import Styles from "../Styles";

const Home = observer(({ userstore, serviceStore }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(true);
  const [location, setLocation] = useState({});
  const windowHeight = Dimensions.get("screen").height;
  const [Service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const [Incedents, setIncedents] = useState([]);

  // fetch Open Incedents

  async function fetchIncedents() {
    // const incedents = await getIncedents(userstore.user.uid);
    // setIncedents(incedents);
    const db = firebase.firestore();
    let inc = [];
    await db
      .collection("incedents")
      .where("userid", "==", userstore.user.uid)
      .where("status", "!=", "Close")
      .where("service", "!=", "Panic")
      .onSnapshot((snapshot) => {
        let snap = snapshot.docChanges();
        console.log("snap", snap);
        snap.forEach((element) => {
          if (element.type == "added") {
            let temp = element.doc.data();
            temp.id = element.doc.id;
            inc.push(temp);
          }
        });
        console.log(inc);
        setIncedents(inc);
      });
  }

  useEffect(() => {
    console.log("incedents", Incedents.length);
    console.log("incedents", Incedents);
  }, [Incedents]);

  useLayoutEffect(() => {
    console.log("useLayoutEffect");
    console.log(userstore.user.uid);

    (async () => {
      console.log("starta async");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      };
      console.log("Location: ", coordinates);
      serviceStore.setLocation(coordinates);
      setLocation(coordinates);
    })();

    const db = firebase.firestore();
    db.collection("incedents")
      .where("userid", "==", userstore.user.uid)
      .where("status", "!=", "Open")
      .onSnapshot((snapshot) => {
        let _inc = [];
        let snap = snapshot.docChanges();
        console.log("snap", snap);
        if (snap.length > 0) {
          snap.forEach((element) => {
            if (element.type == "added") {
              let temp = element.doc.data();
              temp.id = element.doc.id;
              _inc.push(temp);
            }
          });
        }
        console.log("_inc", _inc);
        setIncedents(_inc);
      });
  }, []);

  useEffect(() => {
    // Fetch Products
    console.log(Service);
  }, [Service]);

  const setActive = async (status) => {
    let temp = userstore.prodiverDetails;
    temp.status = status;
    console.log(temp);

    const set = await setProviderActive(userstore.prodiverDetails.id, temp);
    if (set) {
      alert(set);
    }
  };

  const selectedEmergency = (inc) => {
    serviceStore.setEmergency(inc);
    navigation.navigate("EmergencyView");
  };

  const goTo = async (inc) => {
    await serviceStore.setEmergency(inc);
    navigation.navigate("Map");
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
            <View style={Styles.homeNoticeArea}>
              {Incedents.length > 0 ? (
                <View style={Styles.card}>
                  <View>
                    <Text category="h5" style={Styles.cardHeader}>
                      {Incedents[0].service + ": " + Incedents[0].title}
                    </Text>
                    <Text>{Incedents[0].message}</Text>
                    <View style={Styles.cardfooter}>
                      <Button
                        appearance="ghost"
                        status="info"
                        onPress={() => selectedEmergency(Incedents[0])}
                      >
                        View
                      </Button>
                      {Incedents[0].status == "Accepted" && (
                        <Button
                          appearance="outline"
                          status="success"
                          onPress={() => goTo(Incedents[0])}
                        >
                          Currently Active
                        </Button>
                      )}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
            <View style={[Styles.containerRow, Styles.homecontainer]}>
              <TouchableHighlight
                style={Styles.homeButton}
                onPress={() => setIncedent("Police")}
              >
                <Text category="h4" style={Styles.homeButtonText}>
                  Profile
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={Styles.homeButton}
                onPress={() => setIncedent("Ambulance")}
              >
                <Text category="h4" style={Styles.homeButtonText}>
                  Reports
                </Text>
              </TouchableHighlight>
            </View>
            <View style={Styles.containerRow}>
              <TouchableHighlight
                style={Styles.panicBtn}
                onPress={() => setActive("OFF")}
              >
                <Text category="h4" style={Styles.homeButtonText}>
                  Set to Available
                </Text>
              </TouchableHighlight>
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Home;
