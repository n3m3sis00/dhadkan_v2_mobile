import React, { Component } from "react";
import { ImagePickerIOS, Image, Platform, AsyncStorage } from "react-native";
import axios from "axios";
import {
  View,
  Container,
  Content,
  Button,
  Icon,
  Text,
  Header,
  Left,
  Body,
  Right,
  Title,
  Footer,
  FooterTab,
  Badge,
  Item,
  Label,
  Input,
  Spinner,
  Form,
  Textarea,
} from "native-base";
import ImagePicker from "react-native-image-picker";
import Modal from "react-native-modal";
import { baseURL } from "../config";

const options = {
  maxHeight: 1000,
  maxWidth: 1000,
};

class UploadImage extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      type: null,
      medicine: "",
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
      } else if (response.error) {
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

    var body = new FormData();

    if (this.state.image !== null) {
      body.append("photo", {
        uri: this.state.image,
        type: this.state.type,
        name: "photo.jpeg",
      });
    }

    body.append("medicine", this.state.medicine);
    body.append("mobile", this.state.mobile);

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    return fetch(baseURL + "api/classify", fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isModalVisible: false,
        });
        alert("Please check your notifications");
      })
      .catch((error) => {
        this.setState({
          isModalVisible: false,
        });
        alert("Please try again");
      });
  }

  async camera_toggle() {
    console.warn("1");
    ImagePicker.launchCamera(options, (response) => {

      if (response.didCancel) {
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
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
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Spinner color="#c00000" />
          </View>
        </Modal>
        <View style={{ flex: 1 }}>
          <Content
            contentContainerStyle={{ justifyContent: "center", flex: 1 }}
          >
            <Text
              style={{
                color: "#c00000",
                textAlign: "center",
                marginLeft: 30,
                marginRight: 30,
              }}
            >
              ENTER PRESCRIBED MEDICINE {"\n"} (Separate them with commas)
            </Text>

            <Form style={{ flex: 0, justifyContent: "center" }}>
              <Textarea
                rowSpan={7}
                bordered
                placeholder="Eg: Warfarin,Benazepril,Amlodipine,..."
                style={{ backgroundColor: "#fff", margin: 30 }}
                onChangeText={(text) => {
                  this.setState({ medicine: text });
                }}
              />
            </Form>

            <Button
              iconLeft
              onPress={this.uploadImage.bind(this)}
              style={{ alignSelf: "center", backgroundColor: "#024356" }}
            >
              <Icon name="paper-plane" />
              <Text>Send</Text>
            </Button>
          </Content>
        </View>
      </Container>
    );
  }
}

export default UploadImage;
