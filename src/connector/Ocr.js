import React, { Component } from "react";
import {
  Image,
  AsyncStorage,
  Alert,
} from "react-native";
import {
  View,
  Container,
  Content,
  Button,
  Icon,
  Text,
  Spinner,
} from "native-base";
import ImagePicker from "react-native-image-picker";
import Modal from "react-native-modal";
import { baseURL } from "../config";

const options = {
  maxHeight: 500,
  maxWidth: 500,
};

class Ocr extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      type: null,
      mobile: "",
      isModalVisible: false,
    };
  }

  async componentWillMount() {
    try {
      const user_ = await AsyncStorage.getItem("username");

      if (user_ !== null) {
        console.warn(user_);
        this.setState({
          mobile: user_,
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  pickImage(event) {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.warn("User cancelled image picker");
      } else if (response.error) {
        alert("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };

        this.setState({ image: source.uri, type: response.type });
      }
    });
  }

  async uploadImage(event) {
    // const user_ = await AsyncStorage.getItem('username');
    this.setState({
      isModalVisible: true,
    });
    console.warn(this.state.mobile);

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("content-type", "multipart/form-data");

    var body = new FormData();

    if (this.state.image !== null) {
      body.append("photo", {
        uri: this.state.image,
        type: this.state.type,
        name: "photo.jpeg",
      });
    }

    body.append("mobile", this.state.mobile);

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    return fetch(baseURL + "api/ocr", fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isModalVisible: false,
        });
        alert(response.message);
      })
      .catch((error) => {
        this.setState({
          isModalVisible: false,
        });
        Alert.alert(
          "Please Try again",
          "1.Image size is too big\n2.Please Log Out and Login again"
        );
      });
  }

  camera_toggle() {
    ImagePicker.launchCamera(options, (response) => {
      console.warn(response)
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.warn("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({ image: source.uri, type: response.type });
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Modal
          isVisible={this.state.isModalVisible}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Spinner color="#c00000" />
          </View>
        </Modal>

        <Content contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              vertical
              info
              style={{ alignSelf: "center", backgroundColor: "#c00000" }}
              onPress={this.camera_toggle.bind(this)}
            >
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>

            <Button
              vertical
              info
              style={{
                alignSelf: "center",
                marginLeft: "10%",
                backgroundColor: "#c00000",
              }}
              onPress={this.pickImage.bind(this)}
            >
              <Icon name="grid" />
              <Text>Gallery</Text>
            </Button>
          </View>

          {this.state.image ? (
            <Image
              style={{
                height: 300,
                width: 300,
                padding: "10%",
                marginTop: "10%",
                marginBottom: "10%",
                alignSelf: "center",
              }}
              source={{ uri: this.state.image }}
            />
          ) : (
            <Image
              style={{
                height: 300,
                width: 300,
                padding: "10%",
                marginTop: "10%",
                marginBottom: "10%",
                alignSelf: "center",
              }}
              source={require("../img/img_placeholder.png")}
            />
          )}

          <Button
            iconLeft
            onPress={this.uploadImage.bind(this)}
            style={{ alignSelf: "center", backgroundColor: "#024356" }}
          >
            <Icon name="paper-plane" />
            <Text>Send</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Ocr;