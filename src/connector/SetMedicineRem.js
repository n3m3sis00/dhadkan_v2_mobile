//jdnjsn
import React, { Component } from "react";
import {
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Icon,
  Text,
  Button,
  Radio,
  Right,
  Picker,
  ListItem,
  Left,
  Card,
  CardItem,
  Textarea,
  CheckBox,
} from "native-base";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import PopupMenuPatient from "./PopupMenuPatient";
import { baseURL } from "../config";
import moment from "moment";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderColor: "#c00000",
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    margin: 20,
    color: "#000",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  datetime: {
    flex: 1,
    backgroundColor: "#ff4a4a",
    justifyContent: "center",
    alignItems: "center",
  },
  datetimetime: {
    borderLeftColor: "#fff",
    borderLeftWidth: 2,
  },
  datetimetext: {
    fontSize: 22,
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

export default class Reminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false,
      isModalVisible: false,
      chosenDate: new Date(),
      date: new Date(),
      time: { min: "00", hour: 8 },
      pat_list: [],
      repeat: false,
      selected: 1,
      message: "",
      _id: "",
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {};
  };

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
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
        var s = minute + "";
        if (s.length < 2) s = "0" + s;
        this.setState({ time: { hour: hour, min: s } });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  }

  handleDelete(e, n) {
    console.warn(e);
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var month = this.state.date.getMonth() + 1;
      var body = JSON.stringify({
        pk: e,
      });

      const fetchData = {
        method: "POST",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
        body: body,
      };

      const url_ = baseURL + "api/delreminder";
      console.warn(body);
      return fetch(url_, fetchData)
        .then((response) => response.json())
        .then((response) => {
          console.warn(response);

          var pat_list = this.state.pat_list;
          pat_list[n] = null;

          this.setState({
            pat_list: pat_list,
          });
        })
        .catch((error) => {
          console.warn(error);
        });
    } catch (error) {
      // Error retrieving data
      console.warn("eroor error");
    }
  }

  async componentWillMount() {
    try {
      const id = await AsyncStorage.getItem("id");
      console.warn(id);
      var pat_list = [];

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var month = this.state.date.getMonth() + 1;
      var body = JSON.stringify({
        pk: id,
      });

      const fetchData = {
        method: "POST",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
        body: body,
      };

      const url_ = baseURL + "api/getreminders";
      console.warn(body);
      return fetch(url_, fetchData)
        .then((response) => response.json())
        .then((response) => {
          console.warn(response);
          var pat_list = [];
          for (var i = 0; i < response.message.length; i++) {
            const _id = response.message[i]["id"];
            console.warn("hello ids");
            console.warn(_id);
            const n = i;
            const _date = new Date(response.message[i]["date"]);
            console.warn(_date);

            var s = _date.getMinutes() + "";
            if (s.length < 2) s = "0" + s;

            pat_list.push(
              <View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    elevation: 5,
                    margin: 10,
                    paddingTop: 15,
                    paddingBottom: 15,
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 22, color: "grey" }}>
                      {response.message[i]["text"]}
                    </Text>
                    <Text style={{ fontSize: 16, color: "grey" }}>
                      Date:{_date.getDate()}/{_date.getMonth()}/
                      {_date.getFullYear()} Time: {_date.getHours()}:{s}
                    </Text>
                  </View>
                  <Right>
                    <TouchableOpacity onPress={() => this.handleDelete(_id, n)}>
                      <Icon
                        name="trash"
                        style={{
                          fontSize: 30,
                          color: "#c00000",
                          marginRight: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </Right>
                </View>
              </View>
            );
          }

          this.setState({
            pat_list: pat_list,
            _id: id,
          });

          console.log(this.state.pat_list);
        })
        .catch((error) => {
          console.warn(error);
          alert("Please try again");
        });
    } catch (error) {
      // Error retrieving data
      console.warn("eroor error");
    }
  }

  handleAdd() {
    var red_list = this.state.pat_list;

    red_list.push(
      <View>
        <View
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            elevation: 5,
            margin: 10,
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 22, color: "grey" }}>
              {this.state.message}
            </Text>
            <Text style={{ fontSize: 16, color: "grey" }}>
              {this.state.date.getDate()}/{this.state.date.getMonth() + 1}/
              {this.state.date.getFullYear()}
            </Text>
          </View>
          <Right>
            <Icon
              name="paper-plane"
              style={{ fontSize: 30, color: "#024356", marginRight: 20 }}
            />
          </Right>
        </View>
      </View>
    );
    this.setState({
      pat_list: red_list,
    });
  }

  handleRemSet() {
    this.setState({
      isModalVisible: true,
    });
  }

  handleSaveRem() {
    this.setState({
      isModalVisible: false,
    });

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var month = this.state.date.getMonth() + 1;
    var body = JSON.stringify({
      text: this.state.message,
      date:
        this.state.date.getDate() +
        "/" +
        month +
        "/" +
        this.state.date.getFullYear(),
      time: this.state.time,
      repeat: this.state.repeat,
      frequency: this.state.selected,
      pk: this.state._id,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/reminder";
    console.warn(body);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);
        this.handleAdd();
      })
      .catch((error) => {
        alert("Please try again");
        console.warn(error);
      });
  }

  onValueChange(value: string) {
    this.setState({
      selected: value,
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>{this.state.pat_list}</Content>
        <TouchableOpacity onPress={() => this.handleRemSet()}>
          <View
            style={{
              backgroundColor: "#024356",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
            }}
          >
            <Icon
              name="add"
              style={{ fontSize: 30, color: "black"}}
            />
          </View>
        </TouchableOpacity>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Card>
              <CardItem cardBody>
                <Form style={{ flex: 1, justifyContent: "center" }}>
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder="Medicine Name"
                    style={{ backgroundColor: "#fff", marginTop: -2 }}
                    onChangeText={(text) => {
                      this.setState({ message: text });
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#ff4a4a",
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
                          {this.state.date.getDate()}/
                          {this.state.date.getMonth() + 1}/
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

                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#ff4a4a",
                      height: 70,
                      margin: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 5,
                    }}
                  >
                    <View style={styles.datetime}>
                      <Text style={styles.datetimetext}>Repeat</Text>
                    </View>
                    <View style={[styles.datetime, styles.datetimetime]}>
                      <CheckBox
                        checked={this.state.repeat}
                        onPress={() =>
                          this.setState({ repeat: !this.state.repeat })
                        }
                      />
                    </View>
                  </View>

                  {this.state.repeat ? (
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#ff4a4a",
                        height: 70,
                        margin: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 5,
                      }}
                    >
                      <Picker
                        mode="dropdown"
                        placeholder="Select Frequency"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Select Frequency"
                        textStyle={{ fontSize: 30, color: "#fff" }}
                        itemStyle={{
                          backgroundColor: "#d3d3d3",
                          marginLeft: 20,
                          paddingLeft: 50,
                        }}
                        itemTextStyle={{ fontSize: 30, color: "#fff" }}
                        style={{ width: undefined }}
                        selectedValue={this.state.selected}
                        onValueChange={this.onValueChange.bind(this)}
                      >
                        <Picker.Item label="OD (Once daily)" value="1" />
                        <Picker.Item label="BD (Twice daily)" value="0.5" />
                        <Picker.Item label="TDS (Thrice daily)" value="0.33" />
                        <Picker.Item label="Every week" value="7" />
                        <Picker.Item label="Once in 15 days" value="15" />
                        <Picker.Item label="Once a month" value="30" />
                      </Picker>
                    </View>
                  ) : (
                    <Text></Text>
                  )}
                </Form>
              </CardItem>
              <CardItem>
                <Left>
                  <Button
                    iconLeft
                    onPress={() => this.handleSaveRem()}
                    style={{ backgroundColor: "#024356" }}
                  >
                    <Icon name="send" />
                    <Text> Set </Text>
                  </Button>
                </Left>
                <Right>
                  <Button
                    iconLeft
                    onPress={() => {
                      this.setState({ isModalVisible: false });
                    }}
                    style={{ backgroundColor: "#c00000" }}
                  >
                    <Icon name="trash" />
                    <Text>Cancel</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          </View>
        </Modal>
      </Container>
    );
  }
}
