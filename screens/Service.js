import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground, Pressable } from "react-native";
import { observer } from "mobx-react-lite";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Text,
  Button,
  Input,
} from "@ui-kitten/components";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";
import Styles from "../Styles";

import { sendIncedence } from "./../sdk/FirebaseMethods";

import { signInUser } from "./../sdk/FirebaseMethods";

import axios from "axios";

const Service = observer(({ userstore, serviceStore }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [incloca, setInceLoc] = useState([]);
  const [AddressOptions, setAddressOptions] = useState([]);

  useEffect(() => {
    // Fetch Products
    console.log("Services.js");
    console.log(serviceStore);
  }, []);

  function clearForm() {
    setTitle("");
    setAddress("");
    setMessage("");
    navigation.navigate("Home");
  }

  const sendInc = async () => {
    console.log("sendInc()");
    const incedentData = {
      title,
      address,
      location: incloca,
      message,
      service: serviceStore.service,
      userid: userstore.user.uid,
      incent_date: new Date(),
      status: "Open",
    };
    const rt = await sendIncedence(incedentData);
    if (rt) {
      alert("Incedent sent");
      clearForm();
    }
  };

  useEffect(() => {
    authocompleteAddress();
  }, [address]);

  const authocompleteAddress = async () => {
    if (address.length < 5) return;

    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoibnBhdHJpY2siLCJhIjoiY2l4dHpuNWV0MDAyZzMyb2o4YWpmOXg3YiJ9.SekPOie0OLLB3_YNnpsD7Q`;
    const addressOptions = await axios.get(url);
    console.log(addressOptions);
    if (addressOptions.data.features.length == 1) return;
    setAddressOptions(addressOptions.data.features);
  };

  const handleAutoCompleteListClick = (address) => {
    console.log("Selected address: ", address);
    setAddress(address.place_name);
    setInceLoc(address.center);
    setAddressOptions([]);
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
            <View style={Styles.homecontainer}>
              <Text category="h3" style={Styles.authHeader}>
                {serviceStore.service}
              </Text>
              <Input
                size="large"
                placeholder="Title"
                defaultValue={title}
                onChangeText={(text) => setTitle(text)}
                style={Styles.input}
              />
              <Input
                size="large"
                placeholder="Address"
                defaultValue={address}
                onChangeText={(text) => setAddress(text)}
                style={Styles.input}
              />
              {AddressOptions.map((address, i) => {
                return (
                  <Pressable
                    key={i}
                    style={Styles.listItem}
                    onPress={() => handleAutoCompleteListClick(address)}
                  >
                    <Text>{address.place_name}</Text>
                  </Pressable>
                );
              })}

              <Input
                multiline={true}
                textStyle={{ minHeight: 64 }}
                placeholder="Multiline"
                style={Styles.input}
                defaultValue={message}
                onChangeText={(text) => setMessage(text)}
              />
              <Button style={Styles.authButton} onPress={() => sendInc()}>
                SEND
              </Button>
            </View>
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Service;
