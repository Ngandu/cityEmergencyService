import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
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

// import { sendIncedence } from "./../sdk/FirebaseMethods";

import Styles from "../Styles";

const Home = observer(({ userstore, serviceStore }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState({});
  const windowHeight = Dimensions.get("screen").height;
  const [Service, setService] = useState("");

  useLayoutEffect(() => {
    console.log("useLayoutEffect");
    console.log(userstore.user.uid);
    // Get permission for Coordinate
    (async () => {
      console.log("starta async");
      let { status } = await Location.requestPermissionsAsync();
      console.log(status);
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      };
      console.log("Location: ", coordinates);
      setLocation(coordinates);
    })();
  }, []);

  useEffect(() => {
    // Fetch Products
    console.log(Service);
  }, [Service]);

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{ fex: 1, height: "100%" }}
    >
      <ScrollView>
        <View>
          <ApplicationProvider {...eva} theme={eva.light}>
            <View style={[Styles.containerRow, Styles.homecontainer]}>
              <Text>Home</Text>
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Home;
