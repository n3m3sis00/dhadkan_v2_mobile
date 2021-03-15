import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  AsyncStorage,
  Image,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Text,
  Button,
  Card,
  CardItem,
  Body,
} from "native-base";

import { baseURL } from "../config";

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
});

export default class RegisterDoctor extends Component {
  constructor(props) {
    super(props);
    this.handlePressInD = this.handlePressInD.bind(this);
    this.handlePressOutD = this.handlePressOutD.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    name: "",
    password: "",
    mobile: "",
    email: "",
    hospital: "",
  };

  handlePressInD() {
    Animated.spring(this.animatedValueD, {
      toValue: 0.5,
    }).start();
  }
  handlePressOutD() {
    Animated.spring(this.animatedValueD, {
      toValue: 1,
      friction: 3,
      tension: 40,
    }).start();
  }

  handleSubmit = () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      name: this.state.name,
      mobile: this.state.mobile,
      email: this.state.email,
      hospital: this.state.hospital,
      password: this.state.password,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/onboard/doc";
    console.warn(body);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);

        this.saveItem("username", this.state.mobile);
        this.saveItem("password", this.state.password);
        this.saveItem("token", response.Token);
        this.saveItem("id", response.ID.toString());

        this.props.navigation.navigate("DoctorNotification", {
          token: response.Token,
          id: response.ID,
          type: response.Type,
        });
      })
      .catch((error) => {
        try {
          if (error.name === "SyntaxError") {
            alert("Mobile number is already registered");
          }
        } catch (err) {
          alert(
            "Please fill the information correctly : check mobile number, password and doctor number once again"
          );
          console.warn(error.message);
        }
      });
  };

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  render() {
    const animatedStyleD = {
      transform: [{ scale: this.animatedValueD }],
    };
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Content style={{ padding: 10 }}>
          <Form>
            <Card>
              <CardItem>
                <Icon active name="card" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Name"
                    onChangeText={(text) => this.setState({ name: text })}
                  />
                </Item>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <Icon
                  active
                  name="phone-portrait"
                  style={{ color: "#c00000" }}
                />
                <Item>
                  <Input
                    keyboardType="numeric"
                    placeholder="Mobile Number"
                    maxLength={10}
                    onChangeText={(text) => this.setState({ mobile: text })}
                  />
                </Item>
              </CardItem>
              <CardItem>
                <Icon active name="barcode" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(text) => this.setState({ password: text })}
                  />
                </Item>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <Icon active name="mail" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Email"
                    onChangeText={(text) => this.setState({ email: text })}
                  />
                </Item>
              </CardItem>
              <CardItem>
                <Icon active name="globe" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Hospital"
                    onChangeText={(text) => this.setState({ hospital: text })}
                  />
                </Item>
              </CardItem>
            </Card>
          </Form>

          <Card>
            <Image
              source={{ uri: "https://i.ibb.co/HHf2Jsj/heartbeat-cropped.jpg" }}
              style={{ height: 125, flex: 1 }}
            />
          </Card>
        </Content>
        <TouchableOpacity onPress={this.handleSubmit}>
          <View
            style={{
              backgroundColor: "#c00000",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30, color: "#fff" }}>REGISTER</Text>
          </View>
        </TouchableOpacity>
      </Container>
    );
  }
}
