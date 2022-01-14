


// navigator.usb.addEventListener('connect', async event => {
//   // console.log("connect event happened", event);
//   const devs = await navigator.usb.getDevices();
//   const ledgerDevs = validProductIds.filter((d) => d.id === devs[0].productId);
//   if (ledgerDevs.length == 1) {
//     console.log("app presumed:", ledgerDevs[0].name);
//     if (ledgerDevs[0].name === ETHEREUM_APP_NAME) {
//       ethAppFound = true;
//     }
//   } else if (ledgerDevs.length >= 1) {

//   }
//   else console.log("No known ID found");
// });


async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}



async function ListenTest() {
    let i = 0;

    const observer = {
        next: e => {
            console.log("next:", e.type, e);
            // if (e.type === "add") {
            //   // sub.unsubscribe();
            //   // const transport = await TransportWebUSB.open(e.descriptor);
            // }
        },
        error: error => { console.log("error: ", error); },
        complete: () => {
            console.log("complete", i);
        }
    };

    navigator.usb.addEventListener('connect', async event => {
        // console.log("connect event happened", event);
        const devs = await navigator.usb.getDevices();
        const ledgerDevs = validProductIds.filter((d) => d.id === devs[0].productId);
        if (ledgerDevs.length > 0) console.log("app presumed:", ledgerDevs[0].name);
        else console.log("No known ID found");
        // const sub = TransportWebUSB.listen(observer);
    });

    navigator.usb.addEventListener('disconnect', event => {
        console.log("disconnect event happened", event);
        // const sub = TransportWebUSB.listen(observer);
    });


    // await new Observable(TransportWebUSB.listen).toPromise();

    for (; i < 20; i += 1) {
        console.log("loop ", i);
        await sleep(1000);
    }
}

async function HelloWorldWithSleep() {
    var transport = await TransportWebUSB.create();
    try {
        console.log("Transport opened!", transport);
        const ledger_ver = await getVersion(transport);

        console.log("Ledger version object is:", ledger_ver);

        const app_ver = await getAppAndVersion(transport);

        console.log("Current app version is:", app_ver);

        const app_list = await listApps(transport);

        console.log("App lists:", app_list);

        if (app_ver.name !== "Ethereum") {
            await openApp(transport, "Ethereum");

            await sleep(2000);

            transport = await TransportWebUSB.create();

            const eth = new Eth(transport);

            const eth_ver = await eth.getAppConfiguration();

            console.log("Current Ethereum app version is:", eth_ver);
        }

        console.log("END");
    } catch (err) {
        console.log("Caught error:", err);
    } finally {
        if (transport) await transport.close();
        console.log("Closed transport!");
    }
}