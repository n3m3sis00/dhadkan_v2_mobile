//jdnjsn
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  Alert,
  Image
} from "react-native";
import {
  Container,
  Content,
  Icon,
  Text,
  Fab,
  Spinner,
  Button
} from "native-base";
import { baseURL } from "../config";
import Modal from "react-native-modal";
import { TouchableOpacity } from "react-native-gesture-handler";


export default class PatientNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: [],
      doctor: false,
      active: false,
      loading: true,
      loading2:false,
      img: "",
      isModalVisible: false
    };

    this.refresh_ = this.refresh_.bind(this);
  }

  async refresh_(event) {
    this.setState({
      loading: true,
    })
    const { params } = this.props.navigation.state;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + params.token,
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    var url_ = baseURL + "dhadkan/api/notification/patient/" + params.id;
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        var notification_ = [];
        console.warn(response.notifications[0]['isNOTBot'])
        for (var i = 0; i < response.notifications.length ; ++i) {
          notification_.push(
            <View style={styles.notificationcard}>
              {response.notifications[i]["isNOTBot"] ?
                <Text style={[styles.fontstyle, styles.doc]}>
                  Doctor
                  </Text>
                :
                <Text style={[styles.fontstyle, styles.bot]}>
                  Dhadkan Bot
                  </Text>
              }

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
          loading: false,
        });
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
        this.setState({ loading: false });
      });
  }

  handleDetail(not_id) {
    this.setState({
      isModalVisible: true,
      loading2: true,
    })

    const { params } = this.props.navigation.state;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + params.token,
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    var url_ = baseURL + "dhadkan/api/get_notification/" + not_id;
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          img: response['img'],
          loading2: false,
        })
      }).catch((e) => {
        alert(e)
        this.setState({
          loading2: false,
          img: ""
        })
      })
  }

  async componentDidMount() {
    try {
      const user_ = await AsyncStorage.getItem("username");
      const password_ = await AsyncStorage.getItem("password");
      if (user_ !== null) {
        // We have data!!
        console.warn(user_);
      }
    } catch (error) {
      console.warn(error);
    }

    const { params } = this.props.navigation.state;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + params.token,
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    var url_ = baseURL + "dhadkan/api/notification/patient/" + params.id;
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        var notification_ = [];
        console.warn(response.notifications[0])
        for (var i = 0; i < response.notifications.length ; ++i) {
          const id__ = response.notifications[i]["pk"];
          notification_.push(
              <View style={styles.notificationcard} >
                <TouchableOpacity onPress={() => this.handleDetail(id__)}>
                {response.notifications[i]["isNOTBot"] ?
                  <Text style={[styles.fontstyle, styles.doc]} 
                      
                  >
                    Doctor
                    </Text>
                  :
                  <Text style={[styles.fontstyle, styles.bot]}>
                    Dhadkan Bot
                    </Text>
                }
                <Text style={styles.fontstyle}>
                  {response.notifications[i]["text"]}
                </Text>
                <Text style={styles.time_stamp}>
                  {response.notifications[i]["time_stamp"]}
                </Text>         
                </TouchableOpacity>
              </View>
          );
        }
        this.setState({
          notification: notification_,
          loading: false,
        });
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
        this.setState({ loading: false });
      });
  }

  render() {
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
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          style={styles.modal}
        >
          <View style={styles.content}>
            {this.state.loading2 ? (
              <Spinner color="#c00000" />
            ) : (
                  <>
                  {this.state.img !== "" ?
                    <Image
                      style={{ width: 350, height: 350 }}
                      source={{ uri: this.state.img }}
                    /> :
                    <Text>
                      Sorry No Image Associated
                    </Text>
                  }
                  </>
              )}
          </View>
        </Modal>
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
  bot: {
    color: 'red',
  },
  doc: {
    color: 'blue',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    height:500,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});