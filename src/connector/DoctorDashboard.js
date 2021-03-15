import React, { Component } from "react";
import {
  View,
  Button,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, Icon, Spinner, Content, Container, Right } from "native-base";
import { baseURL } from "../config";
import PopupMenuDoctor from "./PopupMenuDoctor";
import firebase from "react-native-firebase";

export default class SecondScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      patients: [],
      token : "",
      id : "",
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      //Heading Menu in Right Side
      headerRight: (
        <PopupMenuDoctor
          nav_noti={() => navigation.navigate("DoctorNotification")}
          nav_report={() => navigation.navigate("Report")}
          nav_guide={() => navigation.navigate("UserGuide")}
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
      type: "doctor",
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
        alert(error);
      });
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
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

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
    }
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  async componentDidMount() {
    // check AsyncStorage and auto login
    try {
      const token_ = await AsyncStorage.getItem("token");
      const id_ = await AsyncStorage.getItem("id");

      if (token_ !== null && id_ !== null) {
        const headers = {
          Authorization: "Token " + token_,
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const fetchData = {
          method: "GET",
          credentials: "same-origin",
          mode: "same-origin",
          headers: headers,
        };

        return fetch(baseURL + "/dhadkan/api/doctor/" + id_, fetchData)
          .then((responsed) => responsed.json())
          .then((responsed) => {
            var pat_list = [];

            for (var i = 0; i < responsed.patients.length; ++i) {
              // console.warn(responsed.patients[i]);
              const id__ = responsed.patients[i]["pk"];

              const gender__ = "";
              if (responsed.patients[i]["gender"] === 1) {
                gender__ = "Male";
              } else {
                gender__ = "Female";
              }
              // console.warn(id__)

              pat_list.push(
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("PatientsDetail", {
                      id: id__,
                      gender: gender__,
                    })
                  }
                >
                  <View>
                    <View
                      style={{
                        height: 80,
                        backgroundColor: "#c00000",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        elevation: 5,
                        margin: 10,
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, color: "#fff" }}>
                          {responsed.patients[i]["name"]}
                        </Text>
                        <Text style={{ color: "#fff" }}>
                          Age: {responsed.patients[i]["date_of_birth"]}
                        </Text>
                      </View>
                      <Right style={{ marginRight: 20 }}>
                        {responsed.patients[i]["gender"] === 1 ? (
                          <Icon
                            name="man"
                            style={{ fontSize: 40, color: "#fff" }}
                          />
                        ) : (
                          <Icon
                            name="woman"
                            style={{ fontSize: 40, color: "#fff" }}
                          />
                        )}
                      </Right>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }

            this.setState({
              patients: pat_list,
              loading: false,
              token : token_,
              id : id_,
            });
          })
          .catch((error) => {
            console.warn(error);
            alert("Please try again");
            this.setState({ loading: false });
          });
      }
    } catch (error) {
      // Error retrieving data
      console.warn(error);
      alert("Please try again");
      this.setState({ loading: false });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <Container>
        {this.state.loading ? (
          <Spinner color="#0000ff" />
        ) : (
          <Content>{this.state.patients}</Content>
        )}
      </Container>
    );
  }
}
