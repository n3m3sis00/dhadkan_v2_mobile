import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Icon,
  Form,
  Input,
  Item,
  Label,
  Spinner,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Button,
  Content,
} from "native-base";
import Menu, { MenuItem } from "react-native-material-menu";
import Modal from "react-native-modal";

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
  buttonSignIn: {
    backgroundColor: "#fff",
    borderColor: "#024356",
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  login: {
    margin: 20,
    color: "#000",
  },
});

class PopupMenuPatient extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      doc_mobile: "",
      doc_name: "",
      doc_id: "",
      _id: "",
      token_: "",
    };
    this.handledocName = this.handledocName.bind(this);
    this.handleChangeDoc = this.handleChangeDoc.bind(this);
  }

  async componentDidMount() {
    try {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      if (id !== null) {
        console.warn("id comes here" + id);
        this.setState({
          _id: id,
          token_: token,
        });
      }
    } catch (error) {
      // Error retrieving data
      alert("Some unknown error occured, please login again");
    }

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

    var url_ = baseURL + "dhadkan/dhadkan/api/doctor";
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
        // console.warn("hi");
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
      });
  }

  handledocName = (text) => {
    this.setState({ doc_mobile: text });
    if (
      this.state.doc_mobile.length === 9 &&
      this.state.doc_data[text] !== undefined
    ) {
      if (Object.keys(this.state.doc_data).includes(text)) {
        this.setState({
          doc_name: this.state.doc_data[text][0],
          doc_id: this.state.doc_data[text][1],
        });
      } else {
        alert("please enter a valid number");
      }
    }
  };

  handleChangeDoc = () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + this.state.token_,
    };

    var body = JSON.stringify({
      d_id: this.state.doc_id,
    });

    const fetchData = {
      method: "PUT",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/patient/" + this.state._id;
    // http://10.54.1.47:50/dhadkan/api/patient/
    console.warn(url_);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);
        // alert("Doctor changed");
        this.setState({
          isModalVisible: false,
        });
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
        this.setState({
          isModalVisible: false,
        });
      });
  };

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  nav_notification = () => {
    this._menu.hide();
    this.props.nav_notification();
  };

  nav_dashboard = () => {
    this._menu.hide();
    this.props.nav_dashboard();
  };

  nav_changeDoc = () => {
    this._menu.hide();
    // this.props.nav_changeDoc();
    this.setState({
      isModalVisible: true,
    });
  };

  nav_refresh = () => {
    this._menu.hide();
    this.props.nav_refresh();
  };

  nav_reminder = () => {
    this._menu.hide();
    this.props.nav_reminder();
  };

  nav_logout = () => {
    this._menu.hide();
    this.props.nav_logout();
  };

  render() {
    return (
      <View>
        <Menu
          ref={this.setMenuRef}
          button={
            <Icon
              name="arrow-dropdown"
              style={{ fontSize: 30, color: "#c00000", marginRight: 10 }}
              onPress={this.showMenu}
            />
          }
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_dashboard}>
              <Icon
                name="home"
                style={{ fontSize: 20, color: "grey", paddingTop: 10 }}
              />
              <Text style={{ fontSize: 15, color: "#c00000", paddingLeft: 15 }}>
                {" "}
                Home
              </Text>
            </MenuItem>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_changeDoc}>
              <Icon
                name="medkit"
                style={{ fontSize: 20, color: "grey", paddingTop: 10 }}
              />
              <Text style={{ fontSize: 15, color: "#c00000", paddingLeft: 15 }}>
                {" "}
                Change Doctor
              </Text>
            </MenuItem>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_logout}>
              <Icon name="log-out" style={{ fontSize: 20, color: "grey" }} />
              <Text style={{ fontSize: 15, color: "#c00000" }}> Log Out</Text>
            </MenuItem>
          </View>
        </Menu>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Card>
              <CardItem cardBody>
                <Form style={{ flex: 1, justifyContent: "center" }}>
                  <Item floatingLabel>
                    <Label>Doctor Number</Label>
                    <Input
                      onChangeText={(text) => this.handledocName(text)}
                      maxLength={10}
                      keyboardType="numeric"
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label>Doctor Name</Label>
                    <Input editable={false} value={this.state.doc_name} />
                  </Item>
                </Form>
              </CardItem>
              <CardItem style={{ marginTop: 15 }}>
                <Left>
                  <Button
                    onPress={this.handleChangeDoc}
                    style={{ backgroundColor: "#024356" }}
                  >
                    <Icon name="refresh" />
                    <Text style={{ color: "#fff", marginRight: 15 }}>
                      Change
                    </Text>
                  </Button>
                </Left>
                <Right>
                  <Button
                    onPress={() => {
                      this.setState({ isModalVisible: false });
                    }}
                    style={{ backgroundColor: "#c00000" }}
                  >
                    <Icon name="trash" />
                    <Text style={{ color: "#fff", marginRight: 15 }}>
                      Cancel
                    </Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          </View>
        </Modal>
      </View>
    );
  }
}

export default PopupMenuPatient;
