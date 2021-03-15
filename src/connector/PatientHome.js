import React, { Component } from "react";
import {
  Platform,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Icon,
  Text,
  Spinner,
} from "native-base";
import Modal from "react-native-modal";
import { baseURL } from "../config";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c11111",
    height: 50,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign:'center'
  },
  text: {
    fontSize: 22,
    marginLeft: 10,
    color: '#fff',
    alignSelf:"center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  datetime: {
    flex: 1,
    backgroundColor: "#c00000",
    justifyContent: "center",
    alignItems: "center",
  },
  datetimetime: {
    borderLeftColor: "#fff",
    borderLeftWidth: 2,
  },
  datetimetext: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    elevation: 5,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default class PatientHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      chosenDate: new Date(),
      date: new Date(),
      time: {},
      weight: "",
      heart_rate: "",
      systolic: "",
      diastolic: "",
      _token: "",
      id: "",
      sending: false,
    };
    this.setDate = this.setDate.bind(this);
    this.handledata = this.handledata.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {};
  };

  toggle_model() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  async componentDidMount() {
    this.setState({
      time: {
        hour: this.state.date.getHours(),
        min: this.state.date.getMinutes(),
      },
    });
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id");
      console.warn(token);
      this.setState({
        _token: token,
        _id: id,
      });
      console.warn(id);
    } catch (error) {
      // Error retrieving data
    }
  }

  async DatePicker() {
    if (Platform.OS === "android") {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: new Date(),
        });
        if (action === DatePickerAndroid.dismissedAction) {
        } else {
          var date = new Date(year, month, day);
          this.setState({ date: date });
        }
      } catch ({ code, message }) {
        console.warn("Cannot open date picker", message);
      }
    }
    if (Platform.OS === "ios") {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    }
  }

  async TimePicker() {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action === TimePickerAndroid.dismissedAction) {
      } else {
        this.setState({ time: { hour: hour, min: minute } });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  }

  handledata = () => {
    this.setState({
      sending: true,
    });
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + this.state._token,
    };

    var body = JSON.stringify({
      weight: this.state.weight,
      heart_rate: this.state.heart_rate,
      systolic: this.state.systolic,
      diastolic: this.state.diastolic,
      patient: this.state._id,
      time_stamp: this.state.chosenDate,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "dhadkan/api/data";
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          sending: false,
        });
        console.warn(response);
        alert("Thanks for submitting data :)");
        this.setState({
          weight: "",
          heart_rate: "",
          systolic: "",
          diastolic: "",
        });
      })
      .catch((error) => {
        this.setState({
          sending: false,
        });
        console.warn(error);
        Alert.alert(
          "Data Not send",
          "1.Don't add decimal values\n2.Log Out and Login again"
        );
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#c00000",
            height: 70,
            margin: 5,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <View style={styles.datetime}>
            <TouchableOpacity onPress={this.DatePicker.bind(this)}>
              <Text style={styles.datetimetext}>
                {this.state.date.getDate()}/{this.state.date.getMonth() + 1}/
                {this.state.date.getFullYear()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.datetime, styles.datetimetime]}>
            {Platform.OS === "android" ? (
              <TouchableOpacity onPress={this.TimePicker.bind(this)}>
                <Text style={styles.datetimetext}>
                  {this.state.time.hour}:{this.state.time.min}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View
            style={{
              height: 250,
              justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: 10,
              borderColor: "red",
              borderWidth: 1,
            }}
          >
            <View style={styles.container}>
              <DatePickerIOS
                date={this.state.chosenDate}
                onDateChange={this.setDate}
              />
            </View>
          </View>
          <TouchableOpacity onPress={this.toggle_model.bind(this)}>
            <View
              style={{
                backgroundColor: "#c00000",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 30, color: "#fff" }}>Confirm</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggle_model.bind(this)}>
            <View
              style={{
                backgroundColor: "#c00000",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 30, color: "#fff" }}>Close</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        <Content>
          <View style={styles.card}>
            <Text style={{ marginLeft: 20, color: "#c00000" }}>Weight</Text>
            <Form>
              <Item>
                <Input
                  value={this.state.weight}
                  keyboardType="numeric"
                  placeholder="Body Weight (in kg)"
                  onChangeText={(text) => this.setState({ weight: text })}
                />
                <Icon
                  name="checkmark-circle"
                  style={{ marginRight: 20, color: "#c00000" }}
                />
              </Item>
            </Form>
          </View>

          <View style={styles.card}>
            <Text style={{ marginLeft: 20, color: "#c00000" }}>Heart Rate</Text>
            <Form>
              <Item>
                <Input
                  value={this.state.heart_rate}
                  keyboardType="numeric"
                  placeholder="Heart Rate (in bpm)"
                  onChangeText={(text) => this.setState({ heart_rate: text })}
                />
                <Icon
                  name="checkmark-circle"
                  style={{ marginRight: 20, color: "#c00000" }}
                />
              </Item>
            </Form>
          </View>

          <View style={styles.card}>
            <Text style={{ marginLeft: 20, color: "#c00000" }}>
              Blood Pressure
            </Text>
            <Form>
              <Item>
                <Input
                  value={this.state.systolic}
                  keyboardType="numeric"
                  placeholder="Systolic (in mmhg)"
                  onChangeText={(text) => this.setState({ systolic: text })}
                />
                <Icon
                  name="checkmark-circle"
                  style={{ marginRight: 20, color: "#c00000" }}
                />
              </Item>
            </Form>
            <Form>
              <Item>
                <Input
                  value={this.state.diastolic}
                  keyboardType="numeric"
                  placeholder="Diastolic (in mmhg)"
                  onChangeText={(text) => this.setState({ diastolic: text })}
                />
                <Icon
                  name="checkmark-circle"
                  style={{ marginRight: 20, color: "#c00000" }}
                />
              </Item>
            </Form>
          </View>
          <TouchableOpacity style={{ marginTop: 30 }} onPress={this.handledata}>
            <View
              style={styles.button}
            >
              <Text style={styles.text}>SEND DATA</Text>
            </View>
          </TouchableOpacity>
        </Content>

        <Modal isVisible={this.state.sending}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Spinner color="#c00000" />
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Sending Notification
            </Text>
          </View>
        </Modal>
      </Container>
    );
  }
}
