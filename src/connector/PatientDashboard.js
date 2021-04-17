//jdnjsn
import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Alert,
} from "react-native";
import {
  Container,
  Content,
  Text,
  Icon
} from "native-base";
import PopupMenuPatient from "./PopupMenuPatient";
import firebase from "react-native-firebase";
import { baseURL } from "../config";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c11111",
    height: 50,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  leftbox: {
    height: 50,
    width: 50,
    backgroundColor: '#660000',
    justifyContent:'center',
    alignItems:"center"
  },
  text: {
    fontSize: 22,
    marginLeft: 10,
    color: '#fff',
    alignSelf:"center"
  }
});

export default class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      name: "",
      password: "",
      mobile: "",
      email: "",
      hospital: "",
      address: "",
      age: "",
      doc_mobile: "",
      gender: "",
      chosenDate: new Date(),
      date: new Date(),
      time: {},
    };
    this.setDate = this.setDate.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      //Heading Menu in Right Side
      headerRight: (
        <PopupMenuPatient
          nav_dashboard={() => navigation.navigate("PatientDashboard")}
          nav_logout={async () => {
            try {
              await AsyncStorage.removeItem("username");
              await AsyncStorage.removeItem("fcmToken");
              await AsyncStorage.removeItem("id");
              await AsyncStorage.removeItem("password");
              // console.warn("hi there");
              navigation.navigate("LoginScreen");
            } catch (error) {
              console.warn("AsyncStorage error: " + error.message);
            }
          }}
        />
      ),
    };
  };

  showAlert(title, body) {
    console.warn(title, body);
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  async componentWillMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  // Fire base functions

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.warn("token absent");
      // console.warn(fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
        console.warn("sending id");
        this.saveFCMId(fcmToken);
      }
    }
  }

  async saveFCMId(fcmToken) {
    const id_ = await AsyncStorage.getItem("id");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      type: "patient",
      fcm: fcmToken,
      id: id_,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/device";
    console.warn(body);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
      });
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  async createNotificationListeners() {
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // console.warn(notificationOpen.notification);
      // this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }



  toggle_model() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  async componentDidMount() {
    try {
      const token_ = await AsyncStorage.getItem("token");
      const id_ = await AsyncStorage.getItem("id");
      this.setState({
        time: {
          hour: this.state.date.getHours(),
          min: this.state.date.getMinutes(),
        },
        token: token_,
        id: id_
      });
    } catch {
      alert("Something went wrong please logout and login again");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Content>
          <TouchableOpacity
            onPress={() => navigate("PatientHome")}
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >                
                <Icon name="paper-plane" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>Send Data</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("SendData2")}
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="paper-plane" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>KCCQ Check</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("Uploadimg")}>
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="medkit" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>
                ABCD Drug Check
              </Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigate("Ocr")}>
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="text" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>OCR</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigate("SendImg")}>
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="image" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>Send Image</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("ReminderMed")}>
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="clock" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>Set Reminder</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate("PatientsDetail", {
                id: this.state.id,
                gender__: "Male",
              })
            }
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="pie" style={{color : '#fff'}}/>
              </View>

              <Text style={styles.text}>Dashboard</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate("PatientNotification", {
                token: this.state.token,
                id: this.state.id,
                gender__: "Male",
              })
            }
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="notifications" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>Notification</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate("UserGuide")
            }
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="book" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>User Guide</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigate("Report")
            }
          >
            <View
              style={styles.button}
            >
              <View
                style={styles.leftbox}
              >
                <Icon name="bug" style={{color : '#fff'}}/>
              </View>
              <Text style={styles.text}>Report</Text>
            </View>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}