import React, { Component } from 'react';
 import { View,Text,TouchableOpacity } from 'react-native';
 import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
 import {Icon} from 'native-base';
 import Modal from "react-native-modal";


 export default class ToolbarDropdown extends Component {
   state = {
     isModalVisible : false,
   };
    openMenu = () => {
      this.setState({
        isModalVisible : true,
      });
    }

   render() {
     const { labels } = this.props;

     return (
       <View>
         <TouchableOpacity onPress={this.openMenu}>
           <Icon name='arrow-dropdown-circle' style = {{fontSize:30, color:'#ccc'}}/>
         </TouchableOpacity>

         <Modal isVisible={this.state.isModalVisible} style={{marginRight:0,marginTop:-10,}} onBackdropPress={() => this.setState({ isModalVisible: false })}>
           <View style={{marginRight:0,marginTop:10,backgroundColor:'#000',borderRadius:10,borderColor:'red',borderWidth:1}}>
           <Text>Hi There</Text>
           </View>
         </Modal>
       </View>

     )
   }
 }
