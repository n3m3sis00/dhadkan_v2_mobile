import React, { Component } from "react";
import {
  View,
  AsyncStorage,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Image,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Form,
  Textarea,
  Spinner,
  Input,
  Item,
} from "native-base";
import Modal from "react-native-modal";
import { baseURL } from "../config";
import { LineChart, Grid, YAxis,XAxis, BarChart, AreaChart, StackedAreaChart } from "react-native-svg-charts";
import * as shape from 'd3-shape'

export default class PatientDetail extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      date_of_birth: "",
      address: "",
      email: "",
      mobile: "",
      data: [],
      token: "",
      gender: "",
      isModalVisible: false,
      notifytext: "",
      device_id: "",
      p_id: "",
      weight_data : [10, 15],
      y_ticks : [],
      heart_data : [{data: [1,2], svg: {stroke : "red"}}, {data: [1,2], svg: {stroke : "red"}}, {data: [1,2], svg: {stroke : "red"}}],
      diff : [{hr:1, dia : 1, sys: 1, weight : 1}, {hr:-1, dia : 4, sys: 21, weight : 10}],
      labels_time : [],
      chat : [],
      med_list : [],
      med_name: "",
      sendingmed: true,
      isModalVisibleMed: true,
    };
    this.handleSendNotify = this.handleSendNotify.bind(this);
  }

  async componentDidMount() {
    const { params } = this.props.navigation.state;

    try {
      const token_ = await AsyncStorage.getItem("token");
      const type_ = await AsyncStorage.getItem("type");
      // console.warn(token_)
      this.setState({
        token: token_,
        type: type_,
        gender: "Male",
        loading: true,
        sending: false,
      });

      // console.warn(this.state.token);

      const headers = {
        Authorization: "Token " + this.state.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const fetchData = {
        method: "GET",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
      };

      return fetch(baseURL + "dhadkan/api/patient/" + params.id, fetchData)
        .then((response) => response.json())
        .then((response) => {
          if(response.device === null){
            alert("Patient has not logged In any physical device")
            this.setState({
              name: response.name,
              date_of_birth: response.date_of_birth,
              address: response.address,
              email: response.email,
              mobile: response.mobile,
              p_id: response.pk,
              gender : response.gender,
            });
          }else{
            this.setState({
              name: response.name,
              date_of_birth: response.date_of_birth,
              address: response.address,
              email: response.email,
              mobile: response.mobile,
              device_id: response.device.device_id,
              p_id: response.pk,
              gender : response.gender,
            });
          }
          

          // console.warn(response.images[0]);
          if(response.device !== null){
          var data_list = [];
          var weight_data = [];
          var sys_data = [];
          var dia_data = [];
          var hr_data = [];
          var labels_time = [];
          if (response.data.length) {
            for (var i = 0; i < response.data.length; ++i) {
              var date_ = new Date(response.data[i]["time_stamp"]);
              var year_ = 1900 + parseFloat(date_.getYear());

              var hours = date_.getHours();
              var minutes = date_.getMinutes();
              var ampm = hours >= 12 ? "pm" : "am";
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? "0" + minutes : minutes;
              var strTime = hours + ":" + minutes + " " + ampm;
              weight_data.push(response.data[i]["weight"]);
              sys_data.push(response.data[i]["systolic"]);
              dia_data.push(response.data[i]["diastolic"]);
              hr_data.push(response.data[i]["heart_rate"]);
              // console.warn(response.data[i])
              data_list.push(
                <Card>
                  <CardItem>
                    <Left>
                      <Body>
                        <Text
                          style={{
                            color: "#c00000",
                            fontWeight: "bold",
                            fontSize: 40,
                            textAlign: "center",
                          }}
                        >
                          {date_.getDate() + "th"}
                        </Text>
                        <Text style={{ color: "#c00000", textAlign: "center" }}>
                          {date_.getMonth() + "/" + year_}
                        </Text>
                        <Text style={{ color: "#c00000", textAlign: "center" }}>
                          {strTime}
                        </Text>
                      </Body>
                    </Left>
                    <Body>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        Weight
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        Heart Rate
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        Systolic
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        Diastolic
                      </Text>
                    </Body>
                    <Right>
                      <Body>
                        <Text style={{ color: "#646464", textAlign: "left" }}>
                          {response.data[i]["weight"] + " Kg"}
                        </Text>
                        <Text style={{ color: "#646464", textAlign: "left" }}>
                          {response.data[i]["heart_rate"] + " bpm"}
                        </Text>
                        <Text style={{ color: "#646464", textAlign: "left" }}>
                          {response.data[i]["systolic"] + " mmHg"}
                        </Text>
                        <Text style={{ color: "#646464", textAlign: "left" }}>
                          {response.data[i]["diastolic"] + " mmHg"}
                        </Text>
                      </Body>
                    </Right>
                  </CardItem>
                </Card>
              );
            }
          }
          if (response.data["time_stamp"]) {
            var date_ = new Date(response.data["time_stamp"]);
            var year_ = 1900 + parseFloat(date_.getYear());

            var hours = date_.getHours();
            var minutes = date_.getMinutes();
            var ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var strTime = hours + ":" + minutes + " " + ampm;

            weight_data.push(response.data[i]["weight"]);
            sys_data.push(response.data[i]["systolic"]);
            dia_data.push(response.data[i]["diastolic"]);
            hr_data.push(response.data[i]["heart_rate"]);
            labels_time.push(date_.getDate() + "/" + date_.getMonth() + "/" + year_);

            // console.warn(response.data[i])
            data_list.push(
              <Card>
                <CardItem>
                  <Left>
                    <Body>
                      <Text
                        style={{
                          color: "#c00000",
                          fontWeight: "bold",
                          fontSize: 40,
                          textAlign: "center",
                        }}
                      >
                        {date_.getDate() + "th"}
                      </Text>
                      <Text style={{ color: "#c00000", textAlign: "center" }}>
                        {date_.getMonth() + "/" + year_}
                      </Text>
                      <Text style={{ color: "#c00000", textAlign: "center" }}>
                        {strTime}
                      </Text>
                    </Body>
                  </Left>
                  <Body>
                    <Text style={{ color: "#646464", textAlign: "left" }}>
                      Weight
                    </Text>
                    <Text style={{ color: "#646464", textAlign: "left" }}>
                      Heart Rate
                    </Text>
                    <Text style={{ color: "#646464", textAlign: "left" }}>
                      Systolic
                    </Text>
                    <Text style={{ color: "#646464", textAlign: "left" }}>
                      Diastolic
                    </Text>
                  </Body>
                  <Right>
                    <Body>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        {response.data["weight"] + " Kg"}
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        {response.data["heart_rate"] + " bpm"}
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        {response.data["systolic"] + " mmHg"}
                      </Text>
                      <Text style={{ color: "#646464", textAlign: "left" }}>
                        {response.data["diastolic"] + " mmHg"}
                      </Text>
                    </Body>
                  </Right>
                </CardItem>
              </Card>
            );
          }

          var images_list = [];
          if (response.images.length) {
            for (var j = 0; j < response.images.length; ++j) {
              // console.warn(response.images[j]["time_stamp"]);
              var date__ = new Date(response.images[j]["time_stamp"]);
              var year__ = 1900 + parseFloat(date__.getYear());

              var hours = date__.getHours();
              var minutes = date__.getMinutes();
              var ampm = hours >= 12 ? "pm" : "am";
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? "0" + minutes : minutes;
              var strTime_ = hours + ":" + minutes + " " + ampm;

              const id__ = response.images[j]["pk"];
              var month = parseFloat(date__.getMonth());

              images_list.push(
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ImageViewer", { pk: id__ })
                  }
                >
                  <Card>
                    <CardItem>
                      <Left>
                        <Body>
                          <Text>
                            {date__.getDate() + "/" + month + "/" + year__}
                          </Text>
                        </Body>
                      </Left>
                      <Right>
                        <Body>
                          <Text>{strTime_}</Text>
                        </Body>
                      </Right>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              );
            }
          }
          if (response.images["time_stamp"]) {
            // console.warn("I'm here")
            var date__ = new Date(response.images["time_stamp"]);
            var year__ = 1900 + parseFloat(date_.getYear());

            var hours = date__.getHours();
            var minutes = date__.getMinutes();
            var ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var strTime_ = hours + ":" + minutes + " " + ampm;

            const id__ = response.images["pk"];
            var month = parseFloat(date__.getMonth());

            images_list.push(
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("ImageViewer", { pk: id__ })
                }
              >
                <Card>
                  <CardItem>
                    <Left>
                      <Body>
                        <Text>
                          {date__.getDate() + "/" + month + "/" + year__}
                        </Text>
                      </Body>
                    </Left>
                    <Right>
                      <Body>
                        <Text>{strTime_}</Text>
                      </Body>
                    </Right>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          }
          
          var chat_list = [];
          if (response.chat.length) {
            for (var j = 0; j < response.chat.length; ++j) {
              var date = response.chat[j]['time_stamp']
              try{
                var date_ = new Date(response.chat[j]["time_stamp"]);
                var year__ = 1900 + parseFloat(date_.getYear());

                var hours = date__.getHours();
                var minutes = date__.getMinutes();
                var ampm = hours >= 12 ? "pm" : "am";
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                var strTime_ = hours + ":" + minutes + " " + ampm;
                var month = parseFloat(date__.getMonth());

                date = date__.getDate() + "/" + month + "/" + year__ + " (" + strTime_ + ")";
              }catch{

              }

              chat_list.push(
                <View style={styles.notificationcard}>
                  <Text style={styles.fontstyle}>
                    {response.chat[j]["text"]}
                  </Text>
                  <Text style={styles.time_stamp}>
                    {date}
                  </Text>
                </View>
              );
            }
          }

          var med_list = [];
          if (response.med.length) {
            for (var j = 0; j < response.med.length; ++j) {
              const _id = response.med[j]['pk'];
              const k = j
              med_list.push(
                <View>
                  <View
                    style={styles.medicine_Card}
                  >
                      <Text style={{flex:0.85, fontSize: 22, color: "grey", marginLeft:10}}>
                        {response.med[j]["text"]}
                      </Text>
                    <Right style={{flex:0.15}}>
                      <Icon
                        name="trash"
                        style={{ fontSize: 30, color: "#c00000", marginRight: 20 }}
                        onPress={() => this.handleDelete(_id, k)}
                      /> 
                    </Right>
                </View>
                </View>
              );
            }
          }
          
          var heart_data_ = [
            {
              data : hr_data,
              svg : {stroke : "rgb(255, 65, 24)"}
            },
            {
              data : dia_data,
              svg : {stroke : "rgb(13, 0, 244)"}
            },
            {
              data : sys_data,
              svg : {stroke : "rgb(13, 177, 24)"}
            }
          ]
          var diff = [];
          for(var i = 1; i < hr_data.length; i++){
            diff.push({
              hr : hr_data[i] - hr_data[i-1],
              dia : dia_data[i] - dia_data[i-1],
              sys : sys_data[i] - sys_data[i-1],
              weight : weight_data[i] - weight_data[i-1],
            });
          }
          this.setState({
            data: data_list,
            images: images_list,
            labels_time : labels_time,
            heart_data : heart_data_,
            weight_data :weight_data,
            diff : diff,
            y_ticks : hr_data, 
            chat : chat_list,
            loading: false,
            med_list: med_list,
          });
        }else{
          this.setState({
            loading: false,
          })
        }
        })
        .catch((error) => {
          Alert.alert(
            "Please Try again ",
            "1.Check Your Internet Connection\n2.Log Out and Login again"
          );
          this.setState({
            loading: false,
          });
        });
      }
      catch{
          Alert.alert(
            "Please Try again",
            "1.Check Your Internet Connection\n2.Log Out and Login again"
          );
          this.setState({
            loading: false,
          });
      }
  }
  
  handleDelete = (e, n) =>{
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization : "Token " + this.state.token,
      };

      var body = JSON.stringify({
        pk: e,
      });

      const fetchData = {
        method: "POST",
        credentials: "same-origin",
        mode: "same-origin",
        headers: headers,
        body: body,
      };
      
      const url_ = baseURL + "api/delmed";
      return fetch(url_, fetchData)
        .then((response) => response.json())
        .then(() => {

          var med_list = this.state.med_list;
          med_list[n] = null

          this.setState({
            med_list: med_list,
          });
        })
        .catch(() => {
        });
    } catch (error) {
      // Error retrieving data
    }
  }


  newAdd = (medicine) =>{
    return <View>
            <View
              style={styles.medicine_Card}
            >

                <Text style={{flex:0.85, fontSize: 22, color: "grey", marginLeft:10 }}>
                  {medicine}
                </Text>
                <Right style={{flex: 0.15}}>
                {this.state.sendingmed ?
                  <Icon
                    name="paper-plane"
                    style={{ fontSize: 30, color: "#024356", marginRight: 20 }}
                  /> :
                  <Icon
                    name="paper-plane"
                    style={{  fontSize: 30, color: "#00ff00", marginRight: 20 }}
                  />
                }
                </Right>
            </View>
          </View>
  }


  handleAddMed = async () =>{
    const newAddition = await this.newAdd(this.state.med_name);
    this.setState({
      med_list: [newAddition, ...this.state.med_list],
      isModalVisibleMed: false,
    })

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " +  this.state.token,
    };

    var body = JSON.stringify({
      med_name: this.state.med_name,
      p_id: this.state.p_id,
    });
    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/medicine";
    // console.warn(body);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then(() => {
        this.setState({
          sendingmed: false,
          med_name: "",
        });
      })
      .catch((error) => {
        Alert.alert(
          "Medicine Not Saved",
          "1.Check Your Internet Connection\n2.Log Out and Login again"
        );
        this.setState({
          sendingmed: true,
        });
      });

  }

  handleSendNotify = () => {
    this.setState({
      sending: true,
    });
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    var body = JSON.stringify({
      p_id: this.state.p_id,
      to: this.state.device_id,
      message: this.state.notifytext,
      from: "me",
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "api/notification";
    // console.warn(body);
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          sending: false,
          isModalVisible: false,
        });
        alert("Notification send");
      })
      .catch((error) => {
        Alert.alert(
          "Please Try again",
          "1.Check Your Internet Connection\n2.Log Out and Login again"
        );
        this.setState({
          sending: false,
          isModalVisible: false,
        });
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        {this.state.loading ? (
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Spinner color="#c00000" />
          </View>
        ) : (
          <Content>
            <Card>
              <CardItem>
                <Left>
                  {this.state.gender === 1 ? (
                    <Thumbnail
                      source={{ uri: "https://i.ibb.co/sm9CWgn/avatar.png" }}
                    />
                  ) : (
                    <Thumbnail
                      source={{
                        uri: "https://i.ibb.co/SVQw7zG/thumnailsjhgsd.png",
                      }}
                    />
                  )}
                  <Body>
                    <Text style={{ fontSize: 22 }}>{this.state.name}</Text>
                  </Body>
                </Left>
                <Right>
                  {this.state.type === 'doctor' ? 
                    <Button
                      iconLeft
                      style={{ backgroundColor: "#c00000" }}
                      onPress={() => {
                        this.setState({ isModalVisible: true });
                      }}
                    >
                      <Icon name="chatbubbles" />
                      <Text>Notify</Text>
                    </Button> : null
                  }
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <Body>
                    <Button transparent>
                      <Text style={{ color: "#c00000" }}>
                        Age : {this.state.date_of_birth}{" "}
                      </Text>
                    </Button>
                  </Body>
                </Left>
                <Body>
                  <Button
                    transparent
                    onPress={() => {
                      Linking.openURL("tel:" + this.state.mobile);
                    }}
                  >
                    <Text style={{ color: "#c00000" }}>
                      {this.state.mobile}
                    </Text>
                  </Button>
                </Body>
                <Right>
                  <Body>
                    <Button transparent>
                      <Text style={{ color: "#c00000" }}>
                        {this.state.gender ? "Male" : "Female"}{" "}
                      </Text>
                    </Button>
                  </Body>
                </Right>
              </CardItem>
            </Card>
              
            <Tabs
              renderTabBar={() => (
                <ScrollableTab style={{ backgroundColor: "#c00000" }} />
              )}
            >
              <Tab 
                heading="Analysis"
                tabStyle={{ backgroundColor: "#c00000" }}
                activeTabStyle={{ backgroundColor: "#c00000" }}
                style={{padding:10}}
              >
                <Card style={{padding:10}}>
                  <Text style={{ color: "#c00000", textAlign: 'center', fontSize:20, marginBottom: -10}}>
                    Weight
                  </Text>
                  <View style={{height: 200, flexDirection: 'row'}} >
                    <YAxis
                      data = {this.state.weight_data}
                      numberOfTicks = {10}
                      contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                      formatLabel = {(value) => `${value} Kg`}
                    />
                    <BarChart
                        style={{flex:1, marginLeft:16}}
                        data={this.state.weight_data}
                        svg={{ fill: 'rgb(134, 65, 244, 0.8)' }}
                        contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                    >
                        <Grid />
                    </BarChart>
                  </View>
                </Card>
                  <Card style={{padding:10}}>
                  <Text style={{ color: "#c00000", textAlign: 'center', fontSize:20, marginBottom: -10}}>
                    HR - BP
                  </Text>
                  <View style={{height: 200, flexDirection: 'row'}} >
                    <YAxis
                      data = {this.state.y_ticks}
                      numberOfTicks = {10}
                      contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                      formatLabel = {(value) => `${value} bpm`}
                    />
                    <LineChart
                        style={{flex:1, marginLeft:16}}
                        data={this.state.heart_data}
                        curve = {shape.curveNatural}
                        contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                    >
                        <Grid />
                    </LineChart>
                  </View>
                  </Card>
                  

                  <Card style={{padding:10}}>
                    <Text style={{ color: "#c00000", textAlign: 'center', fontSize:20, marginBottom: -10}}>
                      Poincare Chart
                    </Text>
                    <View style={{height: 200, flexDirection: 'row'}} >
                      <StackedAreaChart
                        style={{ flex: 1, paddingVertical: 16 }}
                        data={this.state.diff}
                        keys = {['weight', 'hr', 'sys', 'dia']}
                        colors={['rgb(134, 65, 244, 0.5)', 'rgba(255, 65, 24, 0.5)', 'rgba(13, 177, 24, 0.5)', 'rgba(13, 0, 244, 0.5)']}
                        curve={shape.curveNatural}
                        contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                      >
                          <Grid />
                      </StackedAreaChart>
                      
                    </View>
                  </Card>

                  <Card style={{flexDirection: 'row', padding:10}}>
                    <Text style={{flex:1,color:"rgb(134, 65, 244)"}}> 
                        <Icon
                          active
                          name="disc"
                          style={{ color: "rgb(134, 65, 244)", fontSize:15 }}
                        /> 
                         Weight
                    </Text>
                    <Text style={{flex:1,color:"rgb(13, 177, 24)"}}> 
                        <Icon
                          active
                          name="disc"
                          style={{ color: "rgb(13, 177, 24)", fontSize:15 }}
                        /> 
                         Systolic
                    </Text>
                    <Text style={{flex:1,color:"rgb(13, 0, 244)"}}> 
                        <Icon
                          active
                          name="disc"
                          style={{ color: "rgb(13, 0, 244)", fontSize:15 }}
                        /> 
                         Diastolic
                    </Text>
                    <Text style={{flex:1,color:"rgb(255, 65, 24)"}}> 
                        <Icon
                          name="disc"
                          style={{ color: "rgb(255, 65, 24)", fontSize:15}}
                        /> 
                         Heart Rate
                    </Text>
                  </Card>
                  
                  {/* <XAxis
                      style={{flex:1, marginLeft:64}}
                      data={this.state.dia_data}
                      formatLabel={(value, index) => index}
                      contentInset={{ top: 20, bottom: 20, right:20, left:20 }}
                      svg={{ fontSize: 10, fill: 'black' }}
                  /> */}
              </Tab>
              <Tab
                heading="Data"
                tabStyle={{ backgroundColor: "#c00000" }}
                activeTabStyle={{ backgroundColor: "#c00000" }}
                style={{padding:10}}
              >
                {this.state.data}
              </Tab>
              <Tab
                heading="Images"
                tabStyle={{ backgroundColor: "#c00000" }}
                activeTabStyle={{ backgroundColor: "#c00000" }}
                style={{padding:10}}
              >
                {this.state.images}
              </Tab>
              {this.state.type == 'doctor' ?
                <Tab
                  heading="Activity"
                  tabStyle={{ backgroundColor: "#c00000" }}
                  activeTabStyle={{ backgroundColor: "#c00000" }}
                  style={{padding:10}}
                >
                  {this.state.chat}
                </Tab> :
                null
                }

                <Tab
                  heading="Medication"
                  tabStyle={{ backgroundColor: "#c00000" }}
                  activeTabStyle={{ backgroundColor: "#c00000" }}
                  style={{padding:10}}
                >
                  <View style={{padding:10}}>
                    <Item regular style={{flex:1, height:50}}>
                      <Input placeholder = "Type Med Name" onChangeText={(text) => this.setState({med_name: text})} value = {this.state.med_name}/>
                      <Icon
                        name="add"
                        style={{ fontSize: 30, color: "black" }}
                        onPress={() => this.handleAddMed()}
                      />
                    </Item>
                  </View>
                  {this.state.med_list}
                </Tab>
            </Tabs>
          </Content>
        )}

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          {this.state.sending ? (
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Spinner color="#c00000" />
              <Text style={{ textAlign: "center", color: "#fff" }}>
                Sending Notification
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Card>
                {this.state.device_id === "" ?
              <CardItem cardBody>
                  <Text
                  style={{
                    color: "#c00000",
                    textAlign: "center",
                    marginLeft: 30,
                    marginRight: 30,
                  }}
                  >
                    Please ask Patient to use App for Better Monitoring
                    </Text>
                </CardItem> : null
                }
                <CardItem cardBody>
                  <Form style={{ flex: 1, justifyContent: "center" }}>
                    <Textarea
                      rowSpan={7}
                      bordered
                      placeholder="Type your message here"
                      style={{ backgroundColor: "#fff", marginTop: -2 }}
                      onChangeText={(text) => {
                        this.setState({ notifytext: text });
                      }}
                    />
                  </Form>
                </CardItem>
                <CardItem>
                  <Left>
                    <Button
                      iconLeft
                      onPress={this.handleSendNotify}
                      style={{ backgroundColor: "#024356" }}
                    >
                      <Icon name="send" />
                      <Text>Send</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button
                      iconLeft
                      onPress={() => {
                        this.setState({ isModalVisible: false });
                      }}
                      style={{ backgroundColor: "#c00000" }}
                    >
                      <Icon name="trash" />
                      <Text>Cancel</Text>
                    </Button>
                  </Right>
                </CardItem>
              </Card>
            </View>
          )}
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  notificationcard: {
    elevation: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 5,
    paddingLeft: 10,
  },

  fontstyle: {
    fontSize: 15,
    color: "gray",
  },

  time_stamp: {
    fontSize: 10,
    color: "gray",
    textAlign: 'right',
  },
  medicine_Card: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 5,
    margin: 10,
    paddingTop: 15,
    paddingBottom: 15,
    flex:1,
    flexDirection:'row',
  }
});