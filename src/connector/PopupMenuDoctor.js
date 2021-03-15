import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import { Icon } from "native-base";
import Menu, { MenuItem } from "react-native-material-menu";

class PopupMenuDoctor extends React.Component {
  constructor() {
    super();
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  nav_noti = () => {
    this._menu.hide();
    this.props.nav_noti();
  };
  nav_report = () => {
    this._menu.hide();
    this.props.nav_report();
  }

  nav_guide = () => {
    this._menu.hide();
    this.props.nav_guide();
  }

  nav_logout = () => {
    this._menu.hide();
    this.props.nav_logout();
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Menu
          ref={this.setMenuRef}
          button={
            <Icon
              name="arrow-dropdown"
              style={{ fontSize: 30, color: "#c00000", marginRight: 10 }}
              onPress={this.showMenu}
            />
          }
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_noti}>
              <Icon
                name="paper"
                style={{ fontSize: 20, color: "grey", paddingTop: 10 }}
              />
              <Text style={{ fontSize: 15, color: "#c00000", paddingLeft: 15 }}>
                {" "}
                All Notification
              </Text>
            </MenuItem>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_report}>
              <Icon
                name="bug"
                style={{ fontSize: 20, color: "grey", paddingTop: 10 }}
              />
              <Text style={{ fontSize: 15, color: "#c00000", paddingLeft: 15 }}>
                {" "}
                Report
              </Text>
            </MenuItem>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_guide}>
              <Icon
                name="book"
                style={{ fontSize: 20, color: "grey", paddingTop: 10 }}
              />
              <Text style={{ fontSize: 15, color: "#c00000", paddingLeft: 15 }}>
                {" "}
                User Guide
              </Text>
            </MenuItem>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <MenuItem onPress={this.nav_logout}>
              <Icon name="log-out" style={{ fontSize: 20, color: "grey" }} />
              <Text style={{ fontSize: 15, color: "#c00000" }}> Log Out</Text>
            </MenuItem>
          </View>
        </Menu>
      </View>
    );
  }
}

export default PopupMenuDoctor;
