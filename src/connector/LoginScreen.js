import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import {
  Footer,
  Text,
  Icon,
  Form,
  Button,
  Item,
  Input,
  Label,
  Spinner,
  Card,
  CardItem,
  Left,
  Right,
  Container,
} from "native-base";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import { NavigationActions } from "react-navigation";
import { baseURL } from "../config";

const styles = StyleSheet.create({
  main_container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  upper: {
    marginTop: -5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
    width: 150,
    height: 57,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    shadowColor: "#EE1B22",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  text: {
    margin: 20,
    color: "#000",
  },
  main_text: {
    fontFamily: "Cochin",
    fontSize: 40,
    fontWeight: "bold",
    color: "#c00000",
  },
  banner_img: {
    width: 130,
    height: 130,
    borderRadius: 100,
    elevation: 5,
  },
  register_text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  Disclaimer: {
    fontSize: 20,
  },
  login_spinner: {
    display: "none",
  },
  login: {
    margin: 20,
    color: "#000",
  },
  background_img: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
  },
  button_comp: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    shadowColor: "#EE1B22",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  modalView: {
    shadowColor: "#EE1B22",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.handlePressInSignIn = this.handlePressInSignIn.bind(this);
    this.handlePressInDisclaimer = this.handlePressInDisclaimer.bind(this);
    this.handleGenerateOTP = this.handleGenerateOTP.bind(this);
    this.login = this.login.bind(this);
  }

  state = {
    isModalVisible: false,
    isModalVisible1: false,
    isModalVisible2: false,
    isModalVisible4: false,
    isModalVisible5: false,
    user: "",
    password: "",
    token: "",
    id: "",
    spinner: false,
    islogging: false,
    gen_otp_mobile: "",
    otp: "",
    otp_id: "",
    new_pass_confirm: "",
    new_pass: "",
    isverifying: false,
    isgenerate: false,
    ispasswordincorrect: false,
  };

  async componentWillMount() {
    // check AsyncStorage and auto login
    try {
      const user_ = await AsyncStorage.getItem("username");
      const password_ = await AsyncStorage.getItem("password");

      if (user_ !== null && password_ !== null) {
        this.setState({ islogging: true });

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        var body = JSON.stringify({
          user: user_,
          password: password_,
        });

        const fetchData = {
          method: "POST",
          credentials: "same-origin",
          mode: "same-origin",
          headers: headers,
          body: body,
        };

        const url_ = baseURL + "dhadkan/api/login";

        fetch(url_, fetchData)
          .then((response) => response.json())
          .then((response) => {
            if (response.Token) {
              this.saveItem("token", response.Token);
              this.saveItem("id", response.ID.toString());
              this.saveItem("type", response.Type);

              if (response.Type === "doctor") {
                this.setState({ islogging: false });
                this.props.navigation.reset(
                  [
                    NavigationActions.navigate({
                      routeName: "DoctorDashboard",
                    }),
                  ],
                  0
                );
              } else {
                this.props.navigation.reset(
                  [
                    NavigationActions.navigate({
                      routeName: "PatientDashboard",
                    }),
                  ],
                  0
                );
              }
            } else {
              alert(response);
              this.setState({ islogging: false });
            }
          })
          .catch((error) => {
            this.setState({ islogging: false });
            console.warn(error);
          });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  handlePressInSignIn() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  handlePressOutSignIn() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  handlePressInDisclaimer() {
    this.setState({ isModalVisible4: !this.state.isModalVisible4 });
  }

  handlePressOutDisclaimer() {
    this.setState({ isModalVisible4: !this.state.isModalVisible4 });
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  async login(event) {
    this.setState({
      spinner: true,
    });

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      user: this.state.user,
      password: this.state.password,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "dhadkan/api/login";
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        if (response.Token) {
          this.saveItem("username", this.state.user);
          this.saveItem("password", this.state.password);
          this.saveItem("type", response.Type);
          this.saveItem("token", response.Token);
          this.saveItem("id", response.ID.toString());

          if (response.Type === "doctor") {
            this.setState({
              user: "",
              password: "",
            });
            this.props.navigation.reset(
              [
                NavigationActions.navigate({
                  routeName: "DoctorDashboard",
                }),
              ],
              0
            );
          } else {
            this.setState({
              user: "",
              password: "",
            });
            this.props.navigation.reset(
              [
                NavigationActions.navigate({
                  routeName: "PatientDashboard",
                }),
              ],
              0
            );
          }
          this.setState({
            spinner: false,
          });
        } else {
          console.warn(response);
          alert(response);
          this.setState({
            spinner: false,
          });
        }

        this.setState({
          isModalVisible: !this.state.isModalVisible,
        });
      })
      .catch((error) => {
        console.warn(response);
        alert("Please try again");
      });
  }

  handleGenerateOTP = async () => {
    await this.saveItem("hasaskotp", "1");
    this.setState({
      isgenerate: !this.state.isgenerate,
    });

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      user: this.state.gen_otp_mobile,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/gen_otp";
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== undefined) {
          alert(response.message);
          this.setState({
            isgenerate: !this.state.isgenerate,
          });
        } else {
          if (response.otp_id !== undefined) {
            this.setState({ otp_id: response.otp_id });
            this.setState({
              isModalVisible1: false,
              isModalVisible2: true,
              isgenerate: !this.state.isgenerate,
            });
          }
        }
      })
      .catch((error) => {
        alert("Please try again");
        this.setState({
          isgenerate: !this.state.isgenerate,
        });
      });
  };

  handleOTPModel = async () => {
    const is_ = await AsyncStorage.getItem("hasaskotp");
    if (is_ !== null) {
      this.setState({ isModalVisible2: true });
    } else {
      this.setState({ isModalVisible1: true });
    }
  };

  handleReSend = () => {
    AsyncStorage.removeItem("hasaskotp");
    this.setState({ isModalVisible2: false });
    this.setState({ isModalVisible1: true });
  };

  handleVerifyOTP() {
    if (this.state.new_pass === this.state.new_pass_confirm) {
      this.setState({
        isverifying: !this.state.isverifying,
        ispasswordincorrect: false,
      });

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var body = JSON.stringify({
        otp_id: this.state.otp_id,
        new_pass: this.state.new_pass,
        otp: this.state.otp,
      });

      const fetchData = {
        method: "POST",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
        body: body,
      };

      const url_ = baseURL + "api/verify_otp";
      return fetch(url_, fetchData)
        .then((response) => response.json())
        .then((response) => {
          console.warn(response);
          if (response.message !== undefined) {
            alert(response.message);
            this.setState({
              isverifying: !this.state.isverifying,
            });
          } else {
            if (response.U_ID !== undefined) {
              this.setState({
                isModalVisible2: false,
                isverifying: !this.state.isverifying,
              });
              alert("Password changed succesfully please login.");
            }
          }
        })
        .catch((error) => {
          this.setState({
            isModalVisible1: true,
            isModalVisible2: false,
            isverifying: !this.state.isverifying,
          });
          alert("Please try again");
        });
    } else {
      this.setState({
        ispasswordincorrect: true,
      });
    }
    AsyncStorage.removeItem("hasaskotp");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        {this.state.islogging ? (
          <View style={styles.main_container}>
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={{ textAlign: "center", opacity: 1, fontSize: 100 }}
            >
              ❤️
            </Animatable.Text>
            <Animatable.Text
              animation="flash"
              iterationCount="infinite"
              direction="alternate"
              style={{ textAlign: "center", opacity: 1, fontSize: 15 }}
            >
              Loading...
            </Animatable.Text>
          </View>
        ) : (
          <Container>
            <Image
              style={styles.background_img}
              source={require("../img/background-login.png")}
            />
            <View style={styles.main_container}>
              <View style={styles.upper}>
                <View>
                  <Image
                    style={styles.banner_img}
                    source={require("../img/dhadkan.png")}
                  />
                </View>
                <Text style={styles.main_text}>Dhadkan</Text>
                <Text
                  style={{ color: "grey" }}
                  onPress={() => this.setState({ isModalVisible5: true })}
                >
                  (Version 2)
                </Text>
              </View>
              <View style={styles.button_comp}>
                <Text style={styles.register_text}>Register as</Text>
                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableWithoutFeedback
                      onPressOut={() => navigate("RegisterDoctor")}
                    >
                      <View style={styles.button}>
                        <Icon name="thermometer" />
                        <Text style={styles.text}>Doctor</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPressOut={() => navigate("RegisterPatient")}
                    >
                      <View style={styles.button}>
                        <Icon name="people" />
                        <Text style={styles.text}>Patient</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <TouchableWithoutFeedback onPress={this.handlePressInSignIn}>
                    <View style={styles.button}>
                      <Icon name="log-in" />
                      <Text style={styles.text}>Sign In</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableOpacity onPress={() => this.handleOTPModel()}>
                    <Text style={{ color: "grey" }}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Modal
                isVisible={this.state.isModalVisible}
                onBackdropPress={() => this.setState({ isModalVisible: false })}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Card style={[styles.modalView, { padding: 20 }]}>
                    <CardItem cardBody>
                      <Form style={{ flex: 1, justifyContent: "center" }}>
                        <Item
                          regular
                          style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 10,
                          }}
                        >
                          <Input
                            placeholder="Mobile Number"
                            keyboardType="numeric"
                            onChangeText={(text) =>
                              this.setState({ user: text })
                            }
                          />
                        </Item>

                        <Item
                          regular
                          style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 10,
                          }}
                        >
                          <Input
                            placeholder="Password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={(text) =>
                              this.setState({ password: text })
                            }
                          />
                        </Item>
                      </Form>
                    </CardItem>
                    <CardItem style={{ marginTop: 10 }}>
                      <Button
                        iconLeft
                        onPress={() => this.login()}
                        style={[
                          styles.button,
                          {
                            width: "100%",
                            justifyContent: "center",
                            margin: 0,
                          },
                        ]}
                      >
                        <Icon
                          name="log-in"
                          style={
                            this.state.spinner
                              ? { display: "none" }
                              : { color: "#000" }
                          }
                        />
                        <Text
                          style={[
                            styles.login,
                            this.state.spinner ? { display: "none" } : {},
                          ]}
                        >
                          Login
                        </Text>
                        <Spinner
                          style={
                            this.state.spinner
                              ? { color: "#000" }
                              : { display: "none" }
                          }
                        />
                      </Button>
                    </CardItem>
                    <CardItem>
                      <Button
                        iconLeft
                        onPressOut={this.handlePressOutSignIn}
                        style={[
                          styles.button,
                          {
                            width: "100%",
                            justifyContent: "center",
                            margin: 0,
                            marginTop: -10,
                          },
                        ]}
                      >
                        <Icon name="cut" style={{ color: "#000" }} />
                        <Text style={styles.text}>Cancel</Text>
                      </Button>
                    </CardItem>
                  </Card>
                </View>
              </Modal>

              <Modal
                isVisible={this.state.isModalVisible1}
                onBackdropPress={() =>
                  this.setState({ isModalVisible1: false })
                }
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
                          placeholder="Mobile Number"
                          keyboardType="numeric"
                          maxLength={10}
                          onChangeText={(text) =>
                            this.setState({ gen_otp_mobile: text })
                          }
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
                      onPressOut={() => this.handleGenerateOTP()}
                      style={{ backgroundColor: "#024356" }}
                    >
                      {this.state.isgenerate ? (
                        <Spinner color="#fff" style={{ paddingLeft: 5 }} />
                      ) : (
                        <Icon name="paper-plane" />
                      )}
                      <Text style={{ color: "#fff" }}>Generate</Text>
                    </Button>
                  </View>
                </View>
              </Modal>

              <Modal
                isVisible={this.state.isModalVisible2}
                onBackdropPress={() =>
                  this.setState({ isModalVisible2: false })
                }
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
                          placeholder="otp"
                          keyboardType="numeric"
                          onChangeText={(text) => this.setState({ otp: text })}
                        />
                      </Item>
                      <Item regular>
                        <Input
                          placeholder="New Password"
                          secureTextEntry={true}
                          onChangeText={(text) =>
                            this.setState({ new_pass: text })
                          }
                        />
                      </Item>
                      <Item regular>
                        <Input
                          placeholder="Confirm New Password"
                          secureTextEntry={true}
                          onChangeText={(text) =>
                            this.setState({ new_pass_confirm: text })
                          }
                        />
                      </Item>
                      {this.state.ispasswordincorrect ? (
                        <Text style={{ color: "#c00000", fontSize: 12 }}>
                          Passwords does not match.
                        </Text>
                      ) : (
                        <Text></Text>
                      )}
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
                      active={
                        this.state.new_pass === this.state.new_pass_confirm
                      }
                      onPressOut={this.handleVerifyOTP.bind(this)}
                      style={{ backgroundColor: "#024356" }}
                    >
                      {this.state.isverifying ? (
                        <Spinner color="#fff" style={{ paddingLeft: 5 }} />
                      ) : (
                        <Icon name="paper-plane" />
                      )}
                      <Text style={{ color: "#fff" }}>Verify</Text>
                    </Button>
                    <Right>
                      <Button
                        iconLeft
                        onPressOut={() => this.handleReSend()}
                        style={{ backgroundColor: "#024356" }}
                      >
                        <Icon name="paper-plane" />
                        <Text style={{ color: "#fff" }}>Re Send</Text>
                      </Button>
                    </Right>
                  </View>
                </View>
              </Modal>
            </View>
            <Footer style={styles.footer}>
              <View style={styles.main_container}>
                <Text style={{ color: "#c00000" }}>
                  Developed by CompBioLab, IIT Roorkee
                </Text>
                <Text
                  style={{ color: "grey" }}
                  onPress={this.handlePressInDisclaimer}
                >
                  Disclaimer
                </Text>
              </View>
              <Modal
                isVisible={this.state.isModalVisible4}
                onBackdropPress={() =>
                  this.setState({ isModalVisible4: false })
                }
              >
                <View
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    padding: 10,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    We do not owe any medical, legal, financial and any other
                    liability.
                  </Text>
                </View>
              </Modal>

              <Modal
                isVisible={this.state.isModalVisible5}
                onBackdropPress={() =>
                  this.setState({ isModalVisible5: false })
                }
              >
                <View
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    padding: 10,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Version 1.1.6 | Updated on 15-03-2021
                  </Text>
                </View>
              </Modal>
            </Footer>
          </Container>
        )}
      </Container>
    );
  }
}
