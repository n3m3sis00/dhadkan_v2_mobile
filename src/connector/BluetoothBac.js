import React, { Component } from "react";
import { Button, Text, View } from "native-base"
import { BleManager } from 'react-native-ble-plx'




export default class Bluetooth extends Component {
    constructor(props) {
        super(props);
        this.manager = new BleManager();
        this.DEVICE = null
        this.BLUETOOTH_KEY = null
        this.DEVICESMAP = new Map()
        this.state = {
            deviesData: new Set(),
            connect_to: "",
            info: "", values: {}
        };
        this.BASE = "0000%s-0000-1000-8000-00805f9b34fb"
    }

    serviceUUID() {
        return this.BASE % '180d'
    }

    notifyUUID(num) {
        return this.prefixUUID + num + "1" + this.suffixUUID
    }

    writeUUID(num) {
        return this.prefixUUID + num + "2" + this.suffixUUID
    }

    info(message) {
        this.setState({ info: message })
    }

    error(message) {
        this.setState({ info: "ERROR: " + message })
    }

    updateValue(key, value) {
        this.setState({ values: { ...this.state.values, [key]: value } })
    }

    async setupNotifications(device) {
        const service = this.serviceUUID()
        // const characteristicW = "00000002-0000-3512-2118-0009af100700"

        // const characteristic = await device.writeCharacteristicWithResponseForService(
        //     service, characteristicW, "AQ==" /* 0x01 in hex */
        // )

        device.monitorCharacteristicForService("0000180d-0000-1000-8000-00805f9b34fb", "00002a37-0000-1000-8000-00805f9b34fb", (error, characteristic) => {
            if (error) {
                this.error(error.message)
                return
            }
            this.updateValue(characteristic.uuid, characteristic.value)
        })
    }

    scan() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.log("error", error)
                return
            }
            console.log(device.name, device.id)
            if (device.name == 'Mi Smart Band 4') {
                // when paire didn't work CD:A2:B5:14:7A:9A
                this.manager.stopDeviceScan();
                this.DEVICEID = device.id;

                this.connectToDevice();
            }
        });
    }

    async connectToDevice() {
        this.manager.connectToDevice("CD:A2:B5:14:7A:9A")
            .then((device) => {
                console.log("devide", device)
                this.info("Discovering services and characteristics")
                return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
                console.log("device after dis", device)
                this.info("Setting notifications")
                return this.setupNotifications(device)
            })
            .then(() => {
                this.info("Listening...")
                console.log("listening")
            }, (error) => {
                this.error(error.message)
                console.log("Connection error", error)
            })
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
                <Text>Durgesh Kumar </Text>
                {
                    [...this.state.deviesData].map((device, idx) => {
                        return (
                            <Button key={idx} onPress={() => this.connectToDevice(device)}>
                                <Text >{device}</Text>
                            </Button>
                        )
                    })
                }

                <Text>{this.state.info}</Text>
                {/* {Object.keys(this.sensors).map((key) => {
                    return <Text key={key}>
                        {this.sensors[key] + ": " + (this.state.values[this.notifyUUID(key)] || "-")}
                    </Text>
                })} */}
            </View >
        );
    }
}
