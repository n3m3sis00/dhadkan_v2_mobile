//jdnjsn
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Content,
  Icon,
  Text,
  Fab,
  Spinner,
} from "native-base";
import { baseURL } from "../config";

export default class DoctorNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: [],
      doctor: false,
      active: false,
      token : "",
      id : "",
      loading: true,
    };
    this.refresh_ = this.refresh_.bind(this);
  }

  _signOutAsync = async () => {
    console.warn("hihihhhih");
    try {
      await Asyncstorage.clear();
      () => navigation.navigate("LoginScreen");
      console.warn("hi there");
    } catch (error) {
      console.warn("AsyncStorage error: " + error.message);
    }
  };

  async refresh_(event) {
    this.setState({
      loading:true,
    })
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + this.state.token,
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    var url_ = baseURL + "dhadkan/api/notification/doctor/" + this.state.id;
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        var notification_ = [];
        for (var i = 0; i < response.notifications.length; ++i) {
          notification_.push(
            <View style={styles.notificationcard}>
              <Text style={styles.fontstyle}>
                {response.notifications[i]["text"]}
              </Text>
              <Text style={styles.time_stamp}>
                {response.notifications[i]["time_stamp"]}
              </Text>
            </View>
          );
        }
        this.setState({
          notification: notification_,
          loading:false,
        });
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
        this.setState({
          loading:false,
        })
      });
  }

  async componentDidMount() {
    try {
      const user_ = await AsyncStorage.getItem("username");
      const token_ = await AsyncStorage.getItem("token");
      const id_ = await AsyncStorage.getItem("id");
      if (user_ !== null) {
        console.warn(user_);
      }
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + token_,
      };

      const fetchData = {
        method: "GET",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
      };

      var url_ = baseURL + "dhadkan/api/notification/doctor/" + id_;
      return fetch(url_, fetchData)
        .then((response) => response.json())
        .then((response) => {
          var notification_ = [];
          for (var i = 0; i < response.notifications.length; ++i) {
            notification_.push(
              <View style={styles.notificationcard}>
                <Text style={styles.fontstyle}>
                  {response.notifications[i]["text"]}
                </Text>
                <Text style={styles.time_stamp}>
                  {response.notifications[i]["time_stamp"]}
                </Text>
              </View>
            );
          }
          this.setState({
            notification: notification_,
            token : token_,
            id : id_,
            loading:false,
          });
        })
        .catch((error) => {
          console.warn(error);
          alert("Please try again");
          this.setState({
            loading:false,
          })
        });
    }catch (error) {
      console.warn(error);
      this.setState({
        loading:false,
      })
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
      {
            this.state.loading ?
            <View style={{ justifyContent: "center", flex: 1 }}>
               <Spinner color="#c00000" />
            </View> :
            <Content>
               {this.state.notification}
            </Content>
          }

        <View style={{ flex: 0 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#024356", elevation: 10 }}
            position="bottomRight"
            onPress={this.refresh_}
          >
            <Icon name="refresh" style={{ color: "#fff" }} />
          </Fab>
        </View>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  notificationcard: {
    elevation: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 5,
    paddingLeft: 10,
  },

  fontstyle: {
    fontSize: 15,
    color: "gray",
  },

  time_stamp: {
    fontSize: 10,
    color: "gray",
    textAlign: 'right',
  },
});
