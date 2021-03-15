import React, { Component } from "react";
import {
  View,
  Image,
  AsyncStorage,
  Alert,
  PermissionsAndroid
} from "react-native";
import {
  Text,
  Button,
  Icon,
  Spinner,
  Content,
  Container,
  Form,
  Item,
  Input,
} from "native-base";
import Modal from "react-native-modal";
import { baseURL } from "../config";

var RNFS = require("react-native-fs");

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      image: "",
      image_name: "",
      isModalVisible: false,
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleImageName = this.handleImageName.bind(this);
  }

  async componentDidMount() {
    const { params } = this.props.navigation.state;

    // check AsyncStorage and auto login
    try {
      const token_ = await AsyncStorage.getItem("token");
      if (token_ !== null) {
        const headers = {
          Authorization: "Token " + token_,
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const fetchData = {
          method: "GET",
          credentials: "same-origin",
          mode: "same-origin",
          headers: headers,
        };

        return fetch(baseURL + "dhadkan/api/image/" + params.pk, fetchData)
          .then((responsed) => responsed.json())
          .then((responsed) => {
            // var image_ = <Image style={{width: 50, height: 50}} source={{uri: }}/>
            this.setState({
              image: responsed.byte,
              loading: false,
            });
          })
          .catch((error) => {
            console.warn(error);
            Alert.alert(
              "Please Try again",
              "1.Check Your Internet Connection\n2.Log Out and Login again"
            );
            this.setState({ loading: false });
          });
      }
    } catch (error) {
      // Error retrieving data
      console.warn(error);
      Alert.alert(
        "Please Try again",
        "1.Check Your Internet Connection\n2.Log Out and Login again"
      );

      this.setState({ loading: false });
    }
  }

  handleSave = async () => {
    try{
      const imagePath = `${RNFS.ExternalStorageDirectoryPath}/${this.state.image_name}.jpg`;
      var _base64Code = "";
      if (this.state.image.slice(0, 4) === "data") {
        _base64Code = this.state.image.split("data:image/jpeg;base64,")[1];
      } else {
        _base64Code = this.state.image;
      }
      RNFS.writeFile(imagePath, _base64Code, "base64").then(() =>
        alert(this.state.image_name + ".jpg Saved")
      );
    }catch{
        alert("Image Not Saved Please Try Again")
    }
    this.setState({
      isModalVisible: false,
    });
  }

  handleImageName = async () => {
    try {
      if(!PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)){
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title' : "Please grant External Storage permissions",
            'message' : ""
          }
        )
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          await alert("Permission Granted")
          this.setState({
            isModalVisible: true,
          });
          this.handleSave;
        }else{
          alert("Permission Denied")
        }
      }else{
        this.setState({
          isModalVisible: true,
        });
        this.handleSave;
      }
    }catch(err){
      alert(err)
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    var image__ = "";
    if (this.state.image.slice(0, 4) === "data") {
      image__ = this.state.image;
    } else {
      image__ = "data:image/png;base64," + this.state.image;
    }
    return (
      <Container>
        {this.state.loading ? (
          <Spinner color="#c00000" />
        ) : (
          <Content>
            <View
              style={{
                flex:1,
                justifyContent: "center",
                alignItems:'center',
                alignContent: 'center',
                elevation:5,
                paddingTop:30,
              }}
            >
              <Image
                style={{ width: 350, height: 350 }}
                source={{ uri: image__ }}
              />
              <Button
                iconLeft
                onPress={() => this.handleImageName()}
                style={{ flex: 1, backgroundColor: "#024356", alignSelf: 'center', marginTop:30}}
              >
                <Icon name="download" />
                <Text style={{ color: "#fff" }}>Download</Text>
              </Button>
            </View>
          </Content>
        )}

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View
            style={{
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: 20,
            }}
          >
            <View>
              <Form>
                <Item regular>
                  <Input
                    placeholder="Insert Name"
                    onChangeText={(text) => this.setState({ image_name: text })}
                  />
                </Item>
              </Form>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Button
                iconLeft
                onPressOut={this.handleSave}
                style={{ backgroundColor: "#024356" }}
              >
                <Icon name="save" />
                <Text style={{ color: "#fff" }}>Generate</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}
