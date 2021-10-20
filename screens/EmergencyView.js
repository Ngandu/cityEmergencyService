import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
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
} from "@ui-kitten/components";

import { fetchresponses, closeIncedent } from "../sdk/FirebaseMethods";

import Styles from "../Styles";

const EmergencyView = observer(({ userstore, serviceStore }) => {
  const windowHeight = Dimensions.get("screen").height;

  const [pastResponses, setPastResponses] = useState([]);
  const Incedents = serviceStore.selectedEmergency;

  async function getResponses() {
    const resp = await fetchresponses(Incedents.id);
    if (resp.length > 0) {
      setPastResponses(resp);
    }
  }

  useLayoutEffect(() => {
    // Fetch Products
    console.log("EmergencyView");
    getResponses();
  }, []);

  const updateInc = async (inc) => {
    let ret = await closeIncedent(inc);
    if (ret) {
      fetchincedents();
    }
  };

  console.log(pastResponses);

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
        <View>
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
                  Responses
                </Text>
                {pastResponses.map((resp, i) => {
                  return (
                    <View key={i} style={Styles.response}>
                      <Text style={Styles.responsesmall}>
                        From: {resp.from}
                      </Text>
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
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default EmergencyView;
