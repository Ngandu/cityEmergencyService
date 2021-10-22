import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  ScrollView,
  Dimensions,
  ImageBackground,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
// import {
//   ApplicationProvider,
//   Text,
//   Button,
//   Input,
//   View,
// } from "@ui-kitten/components";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

import { sendresponse } from "./../sdk/FirebaseMethods";

import axios from "axios";

import Styles from "./../Styles";

const Mapscreen = observer(({ userstore, serviceStore }) => {
  const navigation = useNavigation();
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const coordinates = {
    latitude: serviceStore.selectedEmergency.location[1],
    longitude: serviceStore.selectedEmergency.location[0],
  };
  const [myLocation, setMyLocation] = useState([]);
  const [Routes, setRoutes] = useState([]);
  const [message, setMessage] = useState("");

  const getRoiutes = async () => {
    console.log("getRoiutes()");
    // let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.longitude}%2C${coordinates.latitude}%3B${myLocation.latitude}%2C${myLocation.longitude}?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoibnBhdHJpY2siLCJhIjoiY2l4dHpuNWV0MDAyZzMyb2o4YWpmOXg3YiJ9.SekPOie0OLLB3_YNnpsD7Q`;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${myLocation.longitude}%2C${myLocation.latitude}%3B${coordinates.longitude}%2C${coordinates.latitude}?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoibnBhdHJpY2siLCJhIjoiY2l4dHpuNWV0MDAyZzMyb2o4YWpmOXg3YiJ9.SekPOie0OLLB3_YNnpsD7Q`;
    console.log(url);
    try {
      axios.get(url).then((data) => {
        // let route = data.data.routes[0].legs[0].steps[0].geometry.coordinates;
        let route = data.data.routes[0].geometry.coordinates;
        // console.log(data.data.routes[0].legs[0].steps[0].geometry.coordinates);
        // console.log("boom", data.data.routes.geometry.coordinates);
        let newC = [];
        route.reverse().map((rt, i) => {
          let temp = {
            longitude: rt[0],
            latitude: rt[1],
          };
          // console.log(temp);
          newC.push(temp);
        });
        console.log(newC);
        // newC.push(myLocation);
        setRoutes(newC);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    console.log("Maps.js");
    console.log(serviceStore.selectedEmergency);
    (async () => {
      // Get permission for Coordinate
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMyLocation(coordinates);
    })();
  }, []);

  useEffect(() => {
    // getRoiutes();
  }, [myLocation]);

  const updateInc = async () => {
    let resp = {
      from: "Service",
      incedentId: serviceStore.selectedEmergency.id,
      respnsetime: new Date(),
      responseMessage: message,
    };

    console.log(resp);
    const b = sendresponse(resp);
    if (b) {
      setMessage("");
      alert("Response sent");
    }
  };

  console.log("myLocation", myLocation);
  console.log(Routes);

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{
        fex: 1,
        height: SCREEN_HEIGHT - 50,
        paddingTop: 5,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        {/* <ApplicationProvider> */}
        {myLocation.latitude && (
          <>
            <MapView
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT - SCREEN_HEIGHT / 3,
              }}
              region={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              zoomControlEnabled={true}
            >
              <Marker
                coordinate={{
                  latitude: myLocation.latitude,
                  longitude: myLocation.longitude,
                }}
                title={"My Location"}
              />
              <Marker
                coordinate={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
                title={"Incedent"}
              />
              <Polyline
                coordinates={Routes}
                coordinates={[myLocation, coordinates]}
                strokeColor="orange"
                strokeWidth={6}
              />
            </MapView>

            <View
              style={[
                Styles.card,
                { width: "100%", flexDirection: "row", marginTop: 30 },
              ]}
            >
              <TextInput
                placeholder="Response..."
                defaultValue={message}
                onChangeText={(txt) => setMessage(txt)}
                style={{ flex: 5 }}
              />
              {/* <Button
                  appearance="outline"
                  status="warning"
                  style={{ flex: 1 }}
                  onPress={() => updateInc(Incedents)}
                >
                  Send
                </Button> */}
              <Button
                title="send"
                onPress={() => updateInc()}
                style={{ backgroundColor: "#004bc9" }}
              />
            </View>
          </>
        )}
        {/* </ApplicationProvider> */}
      </ScrollView>
    </ImageBackground>
  );
});

export default Mapscreen;
