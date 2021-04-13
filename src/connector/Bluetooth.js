import React, { Component } from 'react';
import {
    SafeAreaView,
    PermissionsAndroid,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Text
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

function btoa(data) { return Buffer.from(data, "binary").toString("base64"); }


export default class App extends Component {
    constructor() {
        super();
        this.DEVICEID = null
        this.manager = new BleManager();
        this.state = { characteristic: [], info: '', values: {}, array_services: [] };
        this.CONDEV = null
    }

    // componentDidMount() {
    //     const subscription = this.manager.onStateChange((state) => {
    //         if (state === 'PoweredOn') {
    //             this.scan();
    //             subscription.remove();
    //         }
    //     }, true);
    // }

    scan() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.log("error", error)
                return
            }
            console.log(device.name, device.id)
            if (device.name == 'Mi Smart Band 4') {
                this.manager.stopDeviceScan();
                this.DEVICEID = device.id;

                this._discoveryServices()
            }
        });
    }


    async setupNotifications(device) {
        for (const id in this.sensors) {
            const service = this.serviceUUID(id);
            const characteristicW = this.writeUUID(id);
            const characteristicN = this.notifyUUID(id);

            const characteristic = await device.writeCharacteristicWithResponseForService(
                service,
                characteristicW,
                'AQ==' /* 0x01 in hex */,
            );

            device.monitorCharacteristicForService(
                service,
                characteristicN,
                (error, characteristic) => {
                    if (error) {
                        this.error(error.message);
                        return;
                    }
                    this.updateValue(characteristic.uuid, characteristic.value);
                },
            );
        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Location permission for bluetooth scanning',
                    message: 'wahtever',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async _discoveryServices() {
        const connectedDevice = await this.manager.connectToDevice("CD:A2:B5:14:7A:9A");
        this.CONDEV = connectedDevice

        console.log("devide", connectedDevice)
        const services = await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log("services", services)
        const characteristic = await this.getServicesAndCharacteristics(services);
        console.log("char", characteristic)
        this.setState({ characteristic });
    }

    getServicesAndCharacteristics(device) {
        return new Promise((resolve, reject) => {
            device.services().then(services => {
                console.log("All services", services)
                const characteristics = [];
                const services_and_characteristics = [];
                services.forEach((service, i) => {
                    service.characteristics().then(c => {
                        services_and_characteristics.push({ ...c });


                        characteristics.push(c);
                        console.log({ c });


                        if (i === services.length - 1) {
                            const temp = characteristics.reduce((acc, current) => {
                                return [...acc, ...current];
                            }, []);
                            const dialog = temp.find(
                                characteristic => characteristic.isWritableWithoutResponse,
                            );
                            if (!dialog) {
                                reject('No writable characteristic');
                            }
                            resolve(services_and_characteristics);
                        }
                    });
                });
            });
        });
    }

    _read() {
        const characteristic = this.state.characteristic;
        console.log("shjkcgas", characteristic)
        // characteristic[0][0]
        // .read()
        // .then(res => {
        //     console.log({ res }, '++++++++++++++++++++++++==');
        //     console.log(res.descriptors)
        // })
        // .catch(err => {
        //     console.log({ err }, '++++++++++++++++++++++++==');
        // });

        this.CONDEV.writeCharacteristicWithoutResponseForService('0000fee1-0000-1000-8000-00805f9b34fb','00000009-0000-3512-2118-0009af100700', btoa('\x01\x00')) // STEP 1 ------ we send \x01\x00, converted to base64
        .catch((e)=>{
            console.log(e);
        })

        this.CONDEV.readCharacteristicForService('0000fee1-0000-1000-8000-00805f9b34fb','00000009-0000-3512-2118-0009af100700') // STEP 1 ------ we send \x01\x00, converted to base64
        .then((data) => {
            console.log("this data", data)
        })
        .catch((e)=>{
            console.log(e);
        })
        

        this.CONDEV.monitorCharacteristicForService('0000fee1-0000-1000-8000-00805f9b34fb', '00000009-0000-3512-2118-0009af100700', (error, characteristic) => { 
            if(error){
                console.log(error);                             
            }
            console.log("CHARAR", characteristic)
        })

        this.CONDEV.monitorCharacteristicForService("0000180d-0000-1000-8000-00805f9b34fb", "00002a37-0000-1000-8000-00805f9b34fb", (err, data) => {
            if(err){
                console.log("hr Err", err)
            }
            console.log("data", data)
        })

        // characteristic[6][0]
        // .monitor((err, data) => {
        //     if(err){
        //         console.log("hr Err", err)
        //     }
        //     data.read().then((data) => {console.log("main data", data)}).catch((er) => {console.log(er)})
        //     console.log("data", data)
        //     // console.log("Des", data.descriptors)

        //     // characteristic[6][0]
        //     // .readDescriptor("00002902-0000-1000-8000-00805f9b34fb")
        //     // .then((data) => {
        //     //     console.log("data 2", data)
        //     // })
        // })
        

        

        // this.CONDEV.readCharacteristicForService("00003802-0000-1000-8000-00805f9b34fb", "00004a02-0000-1000-8000-00805f9b34fb", "sdfs")
        // .then((data) => {
        //     console.log("data", data)
        // })
        // .catch((error) => {console.log(error)})
    }

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <TouchableOpacity
                            onPress={() => this._discoveryServices()}
                            style={{
                                height: 50,
                                width: 50,
                                margin: 5,
                                backgroundColor: 'grey',
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => this._read()}
                            style={{ height: 50, width: 50, margin: 5, backgroundColor: 'red' }}
                        />
                        <Text>Durgesh</Text>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}
