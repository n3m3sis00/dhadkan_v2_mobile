import React, { Component } from "react";
import { View, Button, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";
import Modal from "react-native-modal";
export default class SecondScreen extends Component {
  constructor(props) {
    super(props);

    this.handleModel = this.handleModel.bind(this);
  }
  state = {
    isModalVisible: false,
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const headers = {
      Authorization: "Token " + params.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const fetchData = {
      method: "GET",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
    };

    return fetch(
      "http://10.0.2.2:9000/dhadkan/api/doctor/" + params.id,
      fetchData
    )
      .then((response) => response.json())
      .then((response) => {
        console.warn(response);
      })
      .catch((error) => {
        console.warn(error);
        alert("Please try again");
      });
  }

  handleModel() {
    console.warn("shdguchsdhv");
    this.setState({
      isModalVisible: !isModalVisible,
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View>
        <TouchableOpacity
          onPressOut={() =>
            navigate("PatientsDetail", { token: params.token, id: "136" })
          }
        >
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
            <View style={{ flex: 0.3, marginLeft: -20 }}>
              <Icon name="man" style={{ fontSize: 60, color: "#fff" }} />
            </View>
            <View>
              <Text style={{ fontSize: 25, color: "#fff" }}>Durgesh Kumar</Text>
              <Text style={{ color: "#fff" }}>Age:18</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
