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

import { getIncedents, closeIncedent } from "../sdk/FirebaseMethods";

import Styles from "../Styles";
import { useNavigation } from "@react-navigation/native";

const Emergencies = observer(({ userstore, serviceStore }) => {
  const windowHeight = Dimensions.get("screen").height;
  const [Incedents, setIncedents] = useState([]);
  const navigation = useNavigation();

  const fetchincedents = async () => {
    const inc = await getIncedents(userstore.user.uid);
    if (inc.length > 0) {
      setIncedents(inc);
    }
  };

  useLayoutEffect(() => {
    // Fetch Products
    console.log("Emergencies");
    // fetch Incidents
    fetchincedents();
  }, []);

  const updateInc = async (inc) => {
    let ret = await closeIncedent(inc);
    if (ret) {
      fetchincedents();
    }
  };

  const selectedEmergency = (inc) => {
    serviceStore.setEmergency(inc);
    navigation.navigate("EmergencyView");
  };

  console.log(Incedents);

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{
        fex: 1,
        height: windowHeight - 50,
        padding: 10,
        paddingTop: 100,
      }}
    >
      <ScrollView>
        <View>
          <ApplicationProvider {...eva} theme={eva.light}>
            {Incedents.length > 0 ? (
              Incedents.map((inc, key) => {
                let d = inc.incent_date.toDate();
                let dd = new Date(d);
                let ddd =
                  dd.getDate() + "/" + dd.getMonth() + "/" + dd.getFullYear();
                // console.log(ddd);
                return (
                  <View style={Styles.card} key={key}>
                    <View>
                      <Text category="h5" style={Styles.cardHeader}>
                        {inc.service + ": " + inc.title}
                      </Text>
                      <Text>{inc.message}</Text>
                      <Text appearance="hint" style={{ marginTop: 20 }}>
                        Date: {ddd}
                      </Text>
                      <View style={Styles.cardfooter}>
                        <Button
                          appearance="ghost"
                          status="info"
                          onPress={() => updateInc(inc)}
                        >
                          Close
                        </Button>
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
            ) : (
              <Text>You have no incedent reported that not closed.</Text>
            )}
          </ApplicationProvider>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default Emergencies;
