import React, { Component } from "react";
import {
  Image,
  Platform,
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
  Form,
  Textarea
} from "native-base";
import ImagePicker from "react-native-image-picker";
import { baseURL } from "../config";
import Modal from "react-native-modal";

const options = {
  maxHeight: 1000,
  maxWidth: 1000,
};

class SendImage extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      type: null,
      image_data: "",
      medicine: "",
      mobile: "",
      _token: "",
      _id: "",
      sending: false,
      msg : ""
    };
  }

  async componentWillMount() {
    try {
      const user_ = await AsyncStorage.getItem("username");
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id");

      if (user_ !== null) {
        console.warn(user_);
        this.setState({
          mobile: user_,
          _token: token,
          _id: id,
        });
      }
    } catch (error) {
      console.warn(error);
      Alert.alert(
        "Please Try again",
        "1.Check Your Internet Connection\n2.Please Log Out and Login again"
      );
    }
  }

  pickImage(event) {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };

        this.setState({
          image: source.uri,
          type: response.type,
          image_data: "data:image/jpeg;base64," + response.data,
        });
      }
    });
  }

  async uploadImage(event) {
    // const user_ = await AsyncStorage.getItem('username');
    this.setState({
      sending: true,
    });
    console.warn(this.state.mobile);
    var localhost = "";
    if (Platform.OS === "android") {
      localhost = "10.0.2.2";
    }
    if (Platform.OS === "ios") {
      localhost = "localhost";
    }

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("content-type", "multipart/form-data");
    headers.append("Authorization", "Token " + this.state._token);

    var body = new FormData();
    body.append("byte", this.state.image_data);
    body.append("patient", this.state._id);
    body.append("note", this.state.msg);

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    return fetch(baseURL + "dhadkan/api/image", fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          sending: false,
        });
        console.warn(response);
        Alert.alert("Image Sent", "");
      })
      .catch((error) => {
        this.setState({
          sending: false,
        });
        console.warn(error);
        Alert.alert(
          "Please Try again",
          "1.Check Your Internet Connection\n2.Log Out and Login again"
        );
      });
  }

  camera_toggle(event) {
    console.warn("1");
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({
          image: source.uri,
          type: response.type,
          image_data: "data:image/jpeg;base64," + response.data,
        });
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              vertical
              danger
              style={{ alignSelf: "center", backgroundColor: "#c00000" }}
              onPress={this.camera_toggle.bind(this)}
            >
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>

            <Button
              vertical
              danger
              style={{
                alignSelf: "center",
                backgroundColor: "#c00000",
                marginLeft: "10%",
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
                marginTop: "4%",
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
                marginTop: "4%",
                alignSelf: "center",
              }}
              source={require("../img/img_placeholder.png")}
            />
          )}
          <View style={{padding:10}}>
          <Form>
              <Textarea 
                  rowSpan={2} 
                  bordered placeholder="Type your Note here..." 
                  onChangeText={(text) => {
                      this.setState({ msg: text });
                  }}
              />
          </Form>
          <Button
            iconLeft
            block
            onPress={this.uploadImage.bind(this)}
            style={{ backgroundColor: "#024356" , marginTop:10}}
          >
            <Icon name="paper-plane" />
            <Text>Send</Text>
          </Button>
          </View>
        </Content>

        <Modal isVisible={this.state.sending}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Spinner color="#c00000" />
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Sending Image
            </Text>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default SendImage;
