import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  ButtonGroup,
  Modal,
  Input,
} from "@ui-kitten/components";
import * as firebase from "firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

import {
  updateProfile,
  saveRelative,
  fetchRelatives,
  deleteRelatives,
} from "./../sdk/FirebaseMethods";

import Styles from "../Styles";

const Profile = observer(({ userstore }) => {
  const [UserDetails, setUserDetails] = useState([]);
  const [EditProfile, setEditProfile] = useState(false);
  const [AddRelative, setAddRelative] = useState(false);
  const [NewRelative, setNewRelative] = useState([]);
  const [Relatives, setRelatives] = useState([]);

  const windowHeight = Dimensions.get("screen").height;
  const navigation = useNavigation();
  const db = firebase.firestore();

  const getRelatives = async () => {
    fetchRelatives(userstore.user.uid).then((data) => {
      let relatives = [];
      data.forEach((doc) => {
        // console.log(doc);
        let temp = { ...doc.data() };
        temp.id = doc.id;
        relatives.push(temp);
      });
      setRelatives(relatives);
    });
  };

  useEffect(() => {
    console.log("Profile");
    // Fetch Products
    console.log(userstore.user.uid);
    db.collection("users")
      .where("userid", "==", userstore.user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let userD = doc.data();
          setUserDetails(userD);
        });
      });
    getRelatives();
  }, []);

  // Change value from input to variable
  const handleInputChane = (prop, value) => {
    console.log(prop, value);
    let newuser = { ...UserDetails };
    newuser[prop] = value;
    setUserDetails(newuser);
  };

  const handleNewRelativeInputChane = (prop, value) => {
    console.log(prop, value);
    let newuser = { ...NewRelative };
    newuser[prop] = value;
    setNewRelative(newuser);
  };

  // Save profile
  const handleSave = async () => {
    const saved = await updateProfile(UserDetails);
    if (saved) {
      alert("Profile Saved");
      setEditProfile(false);
    }
  };

  // handle saving new relative
  const handlenewrelative = async () => {
    const added = await saveRelative(NewRelative, userstore.user.uid);
    if (added) {
      alert("New relative Added");
      getRelatives();
      setNewRelative([]);
      setAddRelative(false);
    }
  };

  const deleterel = async (id) => {
    try {
      await deleteRelatives(id);
      getRelatives();
      alert("Relative Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backdrop.jpg")}
      resizeMode="cover"
      style={{
        fex: 1,
        height: windowHeight - 50,
      }}
    >
      <ScrollView>
        <View>
          <ApplicationProvider {...eva} theme={eva.light}>
            <View style={Styles.profileHeader}>
              <Text category="h5" style={Styles.profileName}>
                {UserDetails.firstName + " " + UserDetails.lastName}
              </Text>
              <Text style={Styles.profileName}>{UserDetails.email}</Text>
            </View>
            <View style={Styles.profileDetails}>
              <View style={Styles.personalDetails}>
                <Text category="h6">Address</Text>
                <Text>
                  {UserDetails.address
                    ? UserDetails.address
                    : "No address - Please enter you address"}
                </Text>
                <Text category="h6">Cell Phone</Text>
                <Text>{UserDetails.cellphone}</Text>
                <Text category="h6">Residential Number</Text>
                <Text>
                  {UserDetails.resNumber
                    ? UserDetails.resNumber
                    : "No Residential number - Please enter home phone number"}
                </Text>
                <Button
                  style={{ marginTop: 20 }}
                  appearance="ghost"
                  status="info"
                  onPress={() => setEditProfile(true)}
                >
                  <Ionicons name="pencil-outline" size={16} /> Edit Profile
                </Button>
              </View>
              <Text category="h4">Relatives</Text>
              {Relatives.map((elm, key) => {
                return (
                  <View style={Styles.card} key={key}>
                    <Text category="h5">{elm.fullname}</Text>
                    <Text category="h6">Address</Text>
                    <Text>{elm.address}</Text>
                    <Text category="h6">Cell Phone</Text>
                    <Text>{elm.cellphone}</Text>
                    <Text category="h6">Residential Number</Text>
                    <Text>{elm.resNumber}</Text>
                    <ButtonGroup appearance="ghost" status="danger">
                      <Button onPress={() => deleterel(elm.id)}>
                        <Ionicons name="trash-outline" size={16} /> Remove
                      </Button>
                    </ButtonGroup>
                  </View>
                );
              })}

              <Button
                style={{ marginTop: 20 }}
                status="success"
                onPress={() => setAddRelative(true)}
              >
                <Ionicons name="add-circle-outline" size={16} /> Add Relative
              </Button>
            </View>
          </ApplicationProvider>
        </View>

        {/* Profile Modals */}
        <Modal
          visible={EditProfile}
          backdropStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: windowHeight,
          }}
          onBackdropPress={() => setEditProfile(false)}
        >
          <View style={Styles.modalBody}>
            <Text category="h3" style={Styles.centerText}>
              Edit Profile
            </Text>
            <Input
              style={Styles.input}
              size="large"
              placeholder="First Name"
              defaultValue={UserDetails.firstName}
              onChangeText={(txt) => handleInputChane("firstName", txt)}
            />
            <Input
              style={Styles.input}
              size="large"
              placeholder="Last Name"
              defaultValue={UserDetails.lastName}
              onChangeText={(txt) => handleInputChane("lastName", txt)}
            />
            <Input
              style={Styles.input}
              size="large"
              placeholder="Cell Phone"
              defaultValue={UserDetails.cellphone}
              onChangeText={(txt) => handleInputChane("cellphone", txt)}
            />
            <Text>Addreess</Text>
            <Input
              style={Styles.input}
              size="large"
              placeholder="Address"
              defaultValue={UserDetails.address ? UserDetails.address : null}
              onChangeText={(txt) => handleInputChane("address", txt)}
            />
            <Text>Home Phone</Text>
            <Input
              style={Styles.input}
              size="large"
              placeholder="Tel"
              defaultValue={
                UserDetails.resNumber ? UserDetails.resNumber : null
              }
              onChangeText={(txt) => handleInputChane("resNumber", txt)}
            />
            <Button
              status="success"
              style={{ marginBottom: 10 }}
              onPress={() => handleSave()}
            >
              <Ionicons name="save-outline" size={16} /> SAVE CHANGES
            </Button>
            <Button appearance="outline" onPress={() => setEditProfile(false)}>
              CANCEL
            </Button>
          </View>
        </Modal>

        {/* Add Relative Modals */}
        <Modal
          visible={AddRelative}
          backdropStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: windowHeight,
          }}
          onBackdropPress={() => setEditProfile(false)}
        >
          <View style={Styles.modalBody}>
            <Text category="h3" style={Styles.centerText}>
              Add Relative
            </Text>
            <Input
              style={Styles.input}
              size="large"
              placeholder="Fullname"
              onChangeText={(txt) =>
                handleNewRelativeInputChane("fullname", txt)
              }
            />
            <Input
              style={Styles.input}
              size="large"
              placeholder="Address"
              onChangeText={(txt) =>
                handleNewRelativeInputChane("address", txt)
              }
            />
            <Input
              style={Styles.input}
              size="large"
              placeholder="Cell Phone"
              onChangeText={(txt) =>
                handleNewRelativeInputChane("cellphone", txt)
              }
            />
            <Input
              style={Styles.input}
              size="large"
              placeholder="Tel"
              onChangeText={(txt) =>
                handleNewRelativeInputChane("resNumber", txt)
              }
            />
            <Button
              status="success"
              style={{ marginBottom: 10 }}
              onPress={() => handlenewrelative()}
            >
              <Ionicons name="save-outline" size={16} /> SAVE RELATIVE
            </Button>
            <Button appearance="outline" onPress={() => setAddRelative(false)}>
              CANCEL
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
});

export default Profile;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
});
