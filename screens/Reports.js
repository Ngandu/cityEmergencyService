import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, ScrollView, ImageBackground, Dimensions } from "react-native";
import { observer } from "mobx-react-lite";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Text,
  Button,
  Input,
  ButtonGroup,
  Layout,
} from "@ui-kitten/components";

import { incedentsForReports } from "../sdk/FirebaseMethods";
import { useNavigation } from "@react-navigation/native";

import Styles from "../Styles";

const Reports = observer(({ userstore, serviceStore }) => {
  const windowHeight = Dimensions.get("screen").height;
  const navigation = useNavigation();

  const [pastResponses, setPastResponses] = useState([]);
  const [Incedents, setIncedents] = useState({});
  const [filteredInc, setFilteredInc] = useState([]);
  const [status, setStatus] = useState("Closed");

  async function getResponses() {
    const resp = await incedentsForReports(userstore.user.uid);
    console.log(resp);
    setIncedents(resp);
    cleanUp();
  }

  function cleanUp() {
    console.log("cleanup");
    let newInc = [];
    for (let index = 0; index < Incedents.length; index++) {
      const element = Incedents[index];
      if (element.status == status) {
        console.log(element);
        newInc.push(element);
      }
    }
    setFilteredInc(newInc);
  }

  useLayoutEffect(() => {
    // Fetch Products
    console.log("Reports");
    getResponses();
  }, []);

  useEffect(() => {
    cleanUp();
  }, [status]);

  const selectedEmergency = (inc) => {
    serviceStore.setEmergency(inc);
    navigation.navigate("EmergencyView");
  };

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{
        fex: 1,
        height: windowHeight,
        padding: 10,
        paddingTop: 10,
      }}
    >
      <ScrollView>
        <ApplicationProvider {...eva} theme={eva.light}>
          <ButtonGroup
            style={Styles.buttonGroup}
            appearance="filled"
            status="primary"
          >
            <Button
              style={Styles.buttonGroupBtn}
              onPress={() => setStatus("Closed")}
            >
              Closed
            </Button>
            <Button
              style={Styles.buttonGroupBtn}
              onPress={() => setStatus("Open")}
            >
              Opened
            </Button>
            <Button style={Styles.buttonGroupBtn}>R</Button>
          </ButtonGroup>
          {filteredInc.length > 0
            ? filteredInc.map((inc, i) => {
                return (
                  <View style={Styles.card} key={i}>
                    <View>
                      <Text category="h5" style={Styles.cardHeader}>
                        {inc.service + ": " + inc.title}
                      </Text>
                      <Text>{inc.message}</Text>
                      <View style={Styles.cardfooter}>
                        <Button
                          appearance="ghost"
                          status="info"
                          onPress={() => selectedEmergency(inc)}
                        >
                          View
                        </Button>
                      </View>
                    </View>
                  </View>
                );
              })
            : null}
        </ApplicationProvider>
      </ScrollView>
    </ImageBackground>
  );
});

export default Reports;
