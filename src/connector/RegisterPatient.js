//jdnjsn
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
  Radio,
  Right,
  Card,
  Body,
  CardItem,
  Left,
  Thumbnail,
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

export default class RegisterPatient extends Component {
  constructor(props) {
    super(props);

    this.handledocName = this.handledocName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
  }

  state = {
    name: "",
    password: "",
    mobile: "",
    email: "",
    hospital: "",
    address: "",
    age: "",
    doc_mobile: "",
    gender: "1",
    doc_name: "",
    doc_data: {},
    doc_id: "",

    errorage: "",
    errorname: "",
    errormobile: "",
    erroraddress: "",
    errorpassword: "",
    errordoc: "",
  };

  componentDidMount() {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    var url_ = baseURL + "dhadkan/api/doctor";
    // console.warn(url_)
    return fetch(url_)
      .then((response) => response.json())
      .then((response) => {
        doc_data = {};
        for (var i = 0; i < response.length; ++i) {
          doc_data[response[i]["mobile"]] = [
            response[i]["name"],
            response[i]["pk"],
          ];
        }
        this.setState({
          doc_data: doc_data,
        });
        console.warn(doc_data);
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
      });
  }

  handledocName = (text) => {
    this.setState({ doc_mobile: text });
    console.warn(this.state.doc_data[text]);
    if (
      this.state.doc_mobile.length === 9 &&
      this.state.doc_data[text] !== undefined
    ) {
      this.setState({
        doc_name: this.state.doc_data[text][0],
        doc_id: this.state.doc_data[text][1],
      });
    }
  };

  handleFormValidation = () => {
    {
      //error handlers
    }

    if (this.state.name.length === 0) {
      this.setState({
        errorname: "This field is required",
      });
    } else if (this.state.address.length === 0) {
      this.setState({
        errorname: "",
        erroraddress: "This field is required",
      });
    } else if (this.state.age.length === 0) {
      this.setState({
        errorname: "",
        erroraddress: "",
        errorage: "Please enter age",
      });
    } else if (isNaN(this.state.age)) {
      this.setState({
        errorage: "Please enter numerical value",
      });
    } else if (this.state.password.length === 0) {
      this.setState({
        errorage: "",
        errorname: "",
        erroraddress: "",
        errorpassword: "This field is required",
      });
    } else if (this.state.mobile.length !== 10) {
      this.setState({
        errorage: "",
        errorname: "",
        erroraddress: "",
        errormobile: "Please enter valid mobile Number",
      });
    } else if (this.state.doc_name === 0) {
      this.setState({
        errorage: "",
        errormobile: "",
        erroraddress: "",
        errorpassword: "",
        errordoc: "Doctor Not recognized",
      });
    } else {
      this.setState({
        errorage: "",
        errorname: "",
        errormobile: "",
        errorpassword: "",
        erroraddress: "",
      });
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      name: this.state.name,
      mobile: this.state.mobile,
      email: this.state.email,
      address: this.state.address,
      date_of_birth: this.state.age,
      gender: this.state.gender,
      password: this.state.password,
      doctor: this.state.doc_id,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "dhadkan/api/onboard/patient";
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);
        this.props.navigation.navigate("LoginScreen");
        alert("Please Login With Your Credentials");
      })
      .catch((error) => {
        try {
          if (error.name === "SyntaxError") {
            alert("Mobile number is already registered");
          }
        } catch (err) {
          alert(
            "Please fill information correctly : check mobile number, password and doctor number once again"
          );
          console.warn(error.message);
        }
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content style={{ padding: 10, paddingBottom: 200 }}>
          <Form>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>Personal Information</Text>
                    <Text note>Provide Your legal Information</Text>
                  </Body>
                </Left>
                <Right>
                  <Icon
                    active
                    name="information-circle-outline"
                    style={{ color: "#c00000", fontSize: 60 }}
                  />
                </Right>
              </CardItem>

              <CardItem>
                <Icon active name="person" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Your Name"
                    onChangeText={(text) => this.setState({ name: text })}
                  />
                </Item>
              </CardItem>
              {this.state.errorname.length > 0 && (
                <Text
                  style={{
                    color: "#c00000",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.errorname}
                </Text>
              )}

              <CardItem>
                <Icon active name="home" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Address"
                    onChangeText={(text) => this.setState({ address: text })}
                  />
                </Item>
              </CardItem>
              {this.state.erroraddress.length > 0 && (
                <Text
                  style={{
                    color: "#c00000",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.erroraddress}
                </Text>
              )}

              <CardItem>
                <Left>
                  <Icon
                    active
                    name="transgender"
                    style={{ color: "#c00000" }}
                  />
                  <Text>Gender</Text>
                </Left>
                <Body style={{ flexDirection: "row" }}>
                  <Icon active name="man" style={{ color: "#c00000" }} />
                  <Radio
                    onclick=""
                    onPress={() => this.setState({ gender: 1 })}
                    selected={this.state.gender == 1}
                    style={{ marginLeft: 20 }}
                    color="#c00000"
                    selectedColor="#c00000"
                  />

                  <Icon
                    active
                    name="woman"
                    style={{ color: "#c00000", marginLeft: 40 }}
                  />
                  <Radio
                    onclick=""
                    onPress={() => this.setState({ gender: 0 })}
                    selected={this.state.gender == 0}
                    style={{ marginLeft: 20 }}
                    color="#c00000"
                    selectedColor="#c00000"
                  />
                </Body>
              </CardItem>
              <CardItem>
                <Icon active name="calendar" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    keyboardType="numeric"
                    placeholder="Age"
                    onChangeText={(text) => this.setState({ age: text })}
                  />
                </Item>
              </CardItem>
              {this.state.errorage.length > 0 && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.errorage}
                </Text>
              )}
            </Card>

            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>Login Information</Text>
                    <Text note>
                      Insert valid mobile number and secure password
                    </Text>
                  </Body>
                </Left>
                <Right>
                  <Icon
                    active
                    name="cloud-circle"
                    style={{ color: "#c00000", fontSize: 60 }}
                  />
                </Right>
              </CardItem>

              <CardItem>
                <Icon
                  active
                  name="phone-portrait"
                  style={{ color: "#c00000" }}
                />
                <Item>
                  <Input
                    keyboardType="numeric"
                    placeholder="Your Mobile Number"
                    onChangeText={(text) => this.setState({ mobile: text })}
                    maxLength={10}
                  />
                </Item>
              </CardItem>
              {this.state.errormobile.length > 0 && (
                <Text
                  style={{
                    color: "#c00000",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.errormobile}
                </Text>
              )}

              <CardItem>
                <Icon active name="key" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({ password: text })}
                  />
                </Item>
              </CardItem>
              {this.state.errorpassword.length > 0 && (
                <Text
                  style={{
                    color: "#c00000",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.errormobile}
                </Text>
              )}
              <CardItem>
                <Icon active name="mail" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Email(optional)"
                    onChangeText={(text) => this.setState({ email: text })}
                  />
                </Item>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>Doctor Information </Text>
                    <Text note>Insert valid doctor's name and number</Text>
                  </Body>
                </Left>
                <Right>
                  <Icon
                    active
                    name="medkit"
                    style={{ color: "#c00000", fontSize: 60 }}
                  />
                </Right>
              </CardItem>

              <CardItem>
                <Icon
                  active
                  name="phone-portrait"
                  style={{ color: "#c00000" }}
                />
                <Item>
                  <Input
                    keyboardType="numeric"
                    placeholder="Doctor's Number"
                    onChangeText={(text) => this.handledocName(text)}
                    maxLength={10}
                  />
                </Item>
              </CardItem>
              {this.state.errordoc.length > 0 && (
                <Text
                  style={{
                    color: "#c00000",
                    fontSize: 12,
                    marginLeft: 60,
                    marginTop: -10,
                  }}
                >
                  {this.state.errordoc}
                </Text>
              )}

              <CardItem>
                <Icon active name="person" style={{ color: "#c00000" }} />
                <Item>
                  <Input
                    placeholder="Doctor's Name"
                    editable={false}
                    value={this.state.doc_name}
                  />
                </Item>
              </CardItem>
            </Card>

            <Card>
              <Image
                source={{
                  uri: "https://i.ibb.co/HHf2Jsj/heartbeat-cropped.jpg",
                }}
                style={{ height: 125, flex: 1 }}
              />
            </Card>
          </Form>
        </Content>
        <TouchableOpacity onPress={this.handleFormValidation}>
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
