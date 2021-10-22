import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, ScrollView, ImageBackground, Dimensions } from "react-native";
import { observer } from "mobx-react-lite";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Text,
  Button,
  Input,
} from "@ui-kitten/components";

import {
  fetchresponses,
  closeIncedent,
  getOneIncedents,
  acceptIncedent,
} from "../sdk/FirebaseMethods";
import { useNavigation } from "@react-navigation/native";

import Styles from "../Styles";

const EmergencyView = observer(({ userstore, serviceStore }) => {
  const windowHeight = Dimensions.get("screen").height;
  const navigation = useNavigation();

  const [pastResponses, setPastResponses] = useState([]);
  const [Incedents, setIncedents] = useState({});

  async function getResponses() {
    const resp = await fetchresponses(serviceStore.selectedEmergency.id);
    if (resp.length > 0) {
      setPastResponses(resp);
    }
  }

  const fetchincedents = async () => {
    console.log("fetchincedents()");
    const inc = await getOneIncedents(serviceStore.selectedEmergency.id);
    console.log("fetchincedents() - Done");
    setIncedents(inc);
  };

  useLayoutEffect(() => {
    setIncedents(serviceStore.selectedEmergency);
    // Fetch Products
    console.log("EmergencyView");
    getResponses();
  }, []);

  const updateInc = async (inc) => {
    let ret = await closeIncedent(inc);
    if (ret) {
      navigation.navigate("Home");
    }
  };

  const acceptInc = async (inc) => {
    let ret = await acceptIncedent(inc);
    if (ret) {
      navigation.navigate("Map");
    }
  };

  console.log("View status", Incedents.status);

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{
        fex: 1,
        height: windowHeight - 50,
        padding: 10,
        paddingTop: 50,
      }}
    >
      <ScrollView>
        <ApplicationProvider {...eva} theme={eva.light}>
          <View style={Styles.card}>
            <View>
              <Text category="h5" style={Styles.cardHeader}>
                {Incedents.service + ": " + Incedents.title}
              </Text>
              <Text>{Incedents.message}</Text>
              <Text appearance="hint" style={{ marginTop: 20 }}>
                Date: {Date(Incedents.incent_date)}
              </Text>
              <Text category="h6" style={{ marginTop: 30 }}>
                Responses/ Communications
              </Text>
              {pastResponses.map((resp, i) => {
                return (
                  <View key={i} style={Styles.response}>
                    <Text style={Styles.responsesmall}>From: {resp.from}</Text>
                    <Text style={Styles.responsemsg}>
                      {resp.responseMessage}
                    </Text>
                    <Text style={Styles.responsesmall}>
                      Sent: {Date(resp.respnsetime)}
                    </Text>
                  </View>
                );
              })}
              <View style={Styles.cardfooter}>
                {Incedents.status == "Open" && (
                  <Button
                    appearance="ghost"
                    status="info"
                    onPress={() => acceptInc(Incedents)}
                  >
                    Accept
                  </Button>
                )}

                <Button
                  appearance="ghost"
                  status="info"
                  onPress={() => updateInc(Incedents)}
                >
                  Close
                </Button>
              </View>
            </View>
          </View>
        </ApplicationProvider>
      </ScrollView>
    </ImageBackground>
  );
});

export default EmergencyView;
