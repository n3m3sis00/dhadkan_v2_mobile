import React, { Component } from "react";
import {Button, Text, View} from "native-base"
import { BleManager } from 'react-native-ble-plx';


export default class Bluetooth extends Component {
    constructor(props) {
        super(props);
        this.manager = new BleManager();
        this.CONNECT_TO = "LE_WH-XB700"
        this.DEVICESMAP = new Map()
        this.state = {
            deviesData : new Set(),
            connect_to : ""
        };
    }

    scan() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.log("error", error)
                return
            }

            this.setState({
                deviesData : this.state.deviesData.add(device.name)
            })
            this.DEVICESMAP[device.name] = device
            // console.log(this.state.deviesData)
        });
    }

    connectToDevice(name) {
        this.manager.stopDeviceScan();
        this.DEVICESMAP[name].connect()
            .then((device) => {
                const transactionId = 'monitor_battery';
                console.log("device", device)
                console.log("Service UUID", device.services())
                return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
            // Do work on device with services and characteristics
                console.log("device 2", device)
                console.log(device.isConnected())
            })
            .catch((error) => {
                // Handle errors
                console.log("device connection error", error)
            });
    }

    componentDidMount() {
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scan();
                subscription.remove();
            }
        }, true);
    }
    

    render() {
        return (
            <View>
                <Text>Durgsh </Text>
                {
                    [...this.state.deviesData].map((device, idx) => {
                        return (
                            <Button key={idx} onPress={() => this.connectToDevice(device)}>
                                <Text >{device}</Text>
                            </Button>
                    )})
                }
            </View>
        );
    }
}
