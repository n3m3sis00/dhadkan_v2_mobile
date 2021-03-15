import React, { Component } from "react";
import {WebView} from "react-native";

export default class UserGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {
        return (
            <WebView 
                source={{ uri: 'https://n3m3sis00.github.io/dhadkandocs' }} 
            />
        );
    }
}
