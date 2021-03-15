import React from 'react';
import { View, Text } from 'react-native';
import { createRootNavigator } from "./route";

export default class App extends React.Component {
  render() {
    const Routes = createRootNavigator();
    return <Routes />;
  }
}
