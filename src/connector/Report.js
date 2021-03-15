import React, { Component } from "react";
import {
    AsyncStorage,
    Alert,
    View
} from "react-native";
import {
    Text,
    Button,
    Icon,
    Spinner,
    Container,
    Textarea,
    Form
} from "native-base";
import Modal from "react-native-modal";
import { baseURL } from "../config";

export default class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msg_: "",
            user_: "",
            sending: false,
        };
    }

    async componentDidMount() {
    }

    handleReport = async () => {
        try {
            const token_ = await AsyncStorage.getItem("token");
            const id_ = await AsyncStorage.getItem("id");
            const type_ = await AsyncStorage.getItem("type");
            this.setState({
                sending: true,
            });

            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Token " + token_,
              };

            var body = JSON.stringify({
                msg: this.state.msg,
                u_id: id_,
                type : type_
            });

            const fetchData = {
                method: "POST",
                credentials: "same-origin",
                mode: "same-origin",
                headers: headers,
                body: body,
            };
            const url_ = baseURL + "dhadkan/api/report";
            fetch(url_, fetchData)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({
                        sending: false,
                    });
                    alert(response.message);
                })
                .catch((error) => {
                    this.setState({
                        sending: false,
                    });
                    Alert.alert(
                        "Please Try again",
                        "1.Image size is too big\n2.Please Log Out and Login again"
                    );
                });
        } catch(err) {
            console.warn(err)
            this.setState({
                sending: false,
            });
        }
    }

    render() {
        return (
            <Container style={{padding:10}}>
                <Form>
                    <Textarea 
                        rowSpan={10} 
                        bordered placeholder="Type your message here..." 
                        onChangeText={(text) => {
                            this.setState({ msg: text });
                        }}
                    />
                </Form>
                <Button
                    iconLeft
                    onPress={() => this.handleReport()}
                    style={{ alignSelf: "center", backgroundColor: "#024356", marginTop:20 }}
                >
                    <Icon name="paper-plane" />
                    <Text>Send</Text>
                </Button>
                <Modal isVisible={this.state.sending}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Spinner color="#c00000" />
                        <Text style={{ textAlign: "center", color: "#fff" }}>
                            Sending Report
                        </Text>
                    </View>
                </Modal>
            </Container>
        );
    }
}
