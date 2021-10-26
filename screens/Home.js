import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Pressable,
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
      .where("status", "!=", "Closed")
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

  console.log(userstore.prodiverDetails.serviceStatus);

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
              <Pressable
                style={Styles.homeButton}
                onPress={() => setIncedent("Police")}
              >
                <Text category="h4" style={Styles.homeButtonText}>
                  Profile
                </Text>
              </Pressable>
              <Pressable
                style={Styles.homeButton}
                onPress={() => navigation.navigate("reports")}
              >
                <Text category="h4" style={Styles.homeButtonText}>
                  Reports
                </Text>
              </Pressable>
            </View>
            <View style={Styles.containerRow}>
              {userstore.prodiverDetails.serviceStatus != "available" ? (
                <Pressable
                  style={Styles.panicBtn}
                  onPress={() => setActive("available")}
                >
                  <Text category="h4" style={Styles.homeButtonText}>
                    Set to Available
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={Styles.panicBtn}
                  onPress={() => setActive("not available")}
                >
                  <Text category="h4" style={Styles.homeButtonText}>
                    Set to Not Available
                  </Text>
                </Pressable>
              )}
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Home;
