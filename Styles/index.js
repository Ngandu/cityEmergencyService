import { StyleSheet, Dimensions } from "react-native";
const windowHeight = Dimensions.get("screen").height;

const Colors = {
  gey: "#111111",
  grey1: "#dddddd",
  grey2: "#eeeeee",
  yellow: "#eebb19",
  red: "#f0504e",
  white: "#ffffff",
  blue: "#4c8bf5",
  primary: "#004bc9",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  containerColmn: {
    flexDirection: "column",
  },
  containerRow: {
    flexDirection: "row",
  },
  centerText: {
    textAlign: "center",
  },
  input: {
    marginVertical: 2,
    marginBottom: 10,
  },
  homecontainer: {
    paddingTop: 10,
  },
  homeButton: {
    backgroundColor: Colors.yellow,
    flex: 0.5,
    textAlign: "center",
    margin: 5,
    paddingTop: 80,
    paddingBottom: 80,
    borderRadius: 20,
  },
  homeButtonText: {
    color: Colors.white,
    textAlign: "center",
  },
  panicBtn: {
    backgroundColor: Colors.primary,
    flex: 1,
    textAlign: "center",
    margin: 5,
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 20,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardHeader: {
    marginBottom: 10,
    borderBottomColor: Colors.grey1,
    borderBottomWidth: 1,
  },
  cardfooter: {
    flexDirection: "row",
    marginTop: 20,
    borderTopColor: Colors.grey1,
    borderTopWidth: 1,
  },
  profileHeader: {
    backgroundColor: Colors.yellow,
    paddingTop: 140,
    paddingBottom: 40,
  },
  profileName: {
    textAlign: "center",
    color: Colors.white,
  },
  profileDetails: {
    padding: 30,
    backgroundColor: Colors.white,
  },
  personalDetails: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomColor: Colors.grey,
    borderBottomWidth: 0.5,
  },
  modalBody: {
    backgroundColor: Colors.white,
    padding: 10,
    width: 400,
    borderRadius: 10,
  },
  authFormContainer: {
    marginTop: Dimensions.get("screen").height / 4,
    marginHorizontal: 50,
    textAlign: "center",
  },
  authHeader: {
    textAlign: "center",
    marginBottom: 20,
  },
  authInput: {
    borderRadius: 50,
    backgroundColor: Colors.white,
    marginBottom: 20,
    borderColor: Colors.white,
    color: Colors.white,
  },
  authButton: {
    borderRadius: 50,
    backgroundColor: Colors.primary,
    borderColor: Colors.white,
    borderWidth: 0.5,
  },
  authGoogleButton: {
    borderRadius: 50,
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
    marginTop: 20,
  },
  listItem: {
    backgroundColor: Colors.white,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey2,
  },
  response: {
    backgroundColor: Colors.blue,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
  },
  responsemsg: {
    color: Colors.white,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
  },
  responsesmall: {
    fontSize: 10,
    color: Colors.grey,
  },
  activateBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10,
    marginTop: windowHeight - 100,
  },
  homeNoticeArea: {
    width: "100%",
    padding: 10,
    paddingTop: 50,
    height: windowHeight / 3,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonGroupBtn: {
    flex: 1,
    color: Colors.white,
  },
});
