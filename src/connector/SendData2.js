//KCCQ
import React, { Component } from "react";
import {
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Text,
  Radio,
} from "native-base";
import { baseURL } from "../config";
import {question as ques} from './question';
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c11111",
    height: 50,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
  },
  card: {
    backgroundColor: "#fff",
    elevation: 5,
    margin: 10,
    padding: 5,
  },
});

export default class SendData2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      chosenDate: new Date(),
      date: new Date(),
      time: {},
      ques : [],
      _token: "",
      id: "",
      sending: false,
      quesCounter : 0,
      maxques : 15,
      ques1_a: 0, 
      ques1_b : 0,
      ques1_c: 0,
      ques1_d: 0,
      ques1_e: 0,
      ques1_f: 0,
      ques2 : 0,
      ques3 : 0,
      ques4 : 0,
      ques5 : 0,
      ques6 : 0,
      ques7 : 0,
      ques8 : 0,
      ques9 : 0,
      ques10 : 0,
      ques11 : 0,
      ques12 : 0,
      ques13 : 0,
      ques14 : 0,
      ques15_a: 0,
      ques15_b: 0,
      ques15_c: 0,
      ques15_d: 0,
      lang: 0,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {};
  };

  async componentDidMount() {
    this.setState({
      time: {
        hour: this.state.date.getHours(),
        min: this.state.date.getMinutes(),
      },
    });
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id");
      this.setState({
        _token: token,
        _id: id,
      });
    } catch (error) {
      // Error retrieving data
    }
    this.handleQuestion(0);
  }

  handleState = async (ques_idx, i, currQues) => {
    await this.setState((state) => ({
      [ques_idx] : i + 1,
    }))
    this.handleQuestion(currQues);
  }

  handleLang = async () => {
    await this.setState({ lang: !this.state.lang });
    this.handleQuestion(this.state.quesCounter);
  }

  handleQuestion = (ques_idx) => {
    var questions = [];
    if(ques[ques_idx]['is_sub'] === 0){
      var idx_ = ques[ques_idx]['idx'];
      questions.push(<View style={styles.card}>
        {this.state.lang ? (
          <Text style={{fontSize:20}}>
            {ques[ques_idx]['ques_eng']}
          </Text>
        ) : (
          <Text style={{fontSize:20}}>
            {ques[ques_idx]['ques_hnd']}
          </Text>
        )}
        <Form>
          {ques[ques_idx]['options'].map((item,i) => (
            <Item style={{borderColor: "#fff"}}>
              <Radio
                onclick=""
                onPress={() => this.handleState(idx_, i, ques_idx)}
                selected={this.state[idx_] === i + 1 }
                style={{ marginLeft: 10, marginRight:10}}
                color="#c00000"
                selectedColor="#c00000"
              />
              {this.state.lang ? (
                <Text style={{fontSize:15}}>{item['eng']}</Text>
              ) : (
                <Text style={{fontSize:15}}>{item['hnd']}</Text>
              )}
            </Item>
          ))}
        </Form>
      </View>
      )
    }else{
      questions.push(<View style={styles.card}>
        {this.state.lang ? (
          <Text style={{fontSize:20}}>
            {ques[ques_idx]['ques_eng']}
          </Text>
        ) : (
          <Text style={{fontSize:20}}>
            {ques[ques_idx]['ques_hnd']}
          </Text>
        )}
        <Form>
          {ques[ques_idx]['ques_sub'].map((item,i) => (
            <View style={{marginTop:20}}>
              {this.state.lang ? (
                  <Text style={{marginLeft:10, marginBottom:5, fontSize:20}}>{item['ques_eng']}</Text>
                ) : (
                  <Text style={{marginLeft:10, marginBottom:5, fontSize:20}}>{item['ques_hnd']}</Text>
                )}
              {item['options'].map((item2,i2) => (
              <Item style={{borderColor: "#fff"}}>
                <Radio
                  onclick=""
                  onPress={() => this.handleState(item['idx'], i2, ques_idx)}
                  selected={this.state[item['idx']] === i2 + 1}
                  style={{ marginLeft: 10, marginRight:10}}
                  color="#c00000"
                  selectedColor="#c00000"
                />
                {this.state.lang ? (
                  <Text style={{overflowX:'auto', fontSize:15}}>{item2['eng']}</Text>
                ) : (
                  <Text style={{overflowX:'auto', fontSize:15}}>{item2['hnd']}</Text>
                )}
              </Item>
            ))}
            </View>
          ))}
        </Form>
      </View>
      )
    }

    this.setState({
      ques : questions,
      quesCounter : ques_idx,
    })
  };

  handleSubmit = () => {
    this.setState({
      sending: true,
    });
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + this.state._token,
    };

    var body = JSON.stringify({
      ques1_a: this.state.ques1_a, 
      ques1_b : this.state.ques1_b,
      ques1_c: this.state.ques1_c,
      ques1_d: this.state.ques1_d,
      ques1_e: this.state.ques1_e,
      ques1_f: this.state.ques1_f,
      ques2 : this.state.ques2,
      ques3 : this.state.ques3,
      ques4 : this.state.ques4,
      ques5 : this.state.ques5,
      ques6 : this.state.ques6,
      ques7 : this.state.ques7,
      ques8 : this.state.ques8,
      ques9 : this.state.ques9,
      ques10 : this.state.ques10,
      ques11 : this.state.ques11,
      ques12 : this.state.ques12,
      ques13 : this.state.ques13,
      ques14 : this.state.ques14,
      ques15_a : this.state.ques15_a,
      ques15_b : this.state.ques15_b,
      ques15_c : this.state.ques15_c,
      ques15_d : this.state.ques15_d,
      patient: this.state._id,
      time_stamp: this.state.chosenDate,
    });

    const fetchData = {
      method: "POST",
      credentials: "same-origin",
      mode: "same-origin",
      headers: headers,
      body: body,
    };

    const url_ = baseURL + "dhadkan/api/data2";
    return fetch(url_, fetchData)
      .then((response) => response.json())
      .then(() => {
        this.setState({
          sending: false,
        });
        alert("Thanks for submitting data :)");
      })
      .catch((error) => {
        this.setState({
          sending: false,
        });
        Alert.alert(
          "Data Not send",
          "1.Don't add decimal values\n2.Log Out and Login again"
        );
      });
  };

  render() {
    return (
      <Container> 
        <TouchableOpacity
          onPress={() => this.handleLang()}
        >
          <View style={styles.button}>
            {this.state.lang ? (
              <Text style={{ fontSize: 25, color: "#fff" }}>
                हिंदी में पढ़ें
              </Text>
            ) : (
              <Text style={{ fontSize: 25, color: "#fff" }}>
                Read in English
              </Text>
            )}
          </View>
        </TouchableOpacity>       
          <Content>
            {this.state.ques}
          {this.state.quesCounter !== 0 ?
            <TouchableOpacity onPress={() => this.handleQuestion(this.state.quesCounter - 1)}>
              <View style={styles.button}>
                {this.state.lang ? (
                  <Text style={{ fontSize: 30, color: "#fff" }}>Prev</Text>
                ) : (
                  <Text style={{ fontSize: 30, color: "#fff" }}>पिछला</Text>
                )}
              </View>
            </TouchableOpacity> : null
          }
          {this.state.quesCounter !== this.state.maxques - 1 ?
            <TouchableOpacity onPress={() => this.handleQuestion(this.state.quesCounter + 1)}>
              <View style={styles.button}>
                {this.state.lang ? (
                  <Text style={{ fontSize: 30, color: "#fff" }}>Next</Text>
                ) : (
                  <Text style={{ fontSize: 30, color: "#fff" }}>अगला</Text>
                )}
              </View>
            </TouchableOpacity> : 
            <TouchableOpacity onPress={() => this.handleSubmit()}>
            <View style={styles.button}>
              {this.state.lang ? (
                <Text style={{ fontSize: 30, color: "#fff" }}>Submit</Text>
              ) : (
                <Text style={{ fontSize: 30, color: "#fff" }}>पुष्टि करें</Text>
              )}
            </View>
          </TouchableOpacity>
          }   
        </Content>
      </Container>
    );
  }
}
