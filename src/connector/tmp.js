this.CONDEV.monitorCharacteristicForService("0000180d-0000-1000-8000-00805f9b34fb", "00002a37-0000-1000-8000-00805f9b34fb", (error, charac) => {
    if(error){
        console.log("HR error", error)
    }
    console.log("charac", charac)
})

this.CONDEV.readCharacteristicForService("0000180d-0000-1000-8000-00805f9b34fb", "00002a39-0000-1000-8000-00805f9b34fb")
.then((data) => {
    console.log("HR data", data)
})
.catch((e) => {
    console.log(e)
})