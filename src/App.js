import logo from './logo.svg';
import './App.css';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import getVersion from "@ledgerhq/live-common/lib/hw/getVersion";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";
import openApp from "@ledgerhq/live-common/lib/hw/openApp";
import listApps from "@ledgerhq/live-common/lib/hw/listApps";
import Eth from "@ledgerhq/hw-app-eth";

const validProductIds = [
  {
      id: 4117,
      name: "Ethereum",
  },
  {
      id: 4113,
      name: "BOLOS",
  }
];

const ETHEREUM_APP_NAME = "Ethereum";

async function HelloWorldEventDriven() {

  var transport = null;

  try {
    transport = await TransportWebUSB.create();
    console.log("Transport opened!", transport);

    const ledger_ver = await getVersion(transport);

    console.log("Ledger version object is:", ledger_ver);

    const app_ver = await getAppAndVersion(transport);

    console.log("Current app version is:", app_ver);

    const app_list = await listApps(transport);

    console.log("App lists:", app_list);

    if (app_ver.name !== ETHEREUM_APP_NAME) {
      navigator.usb.addEventListener('connect', async function cb(event) {
        try {
          navigator.usb.removeEventListener('connect', cb);

          transport = await TransportWebUSB.create();

          const app_ver = await getAppAndVersion(transport);

          if (app_ver.name !== ETHEREUM_APP_NAME) {
            // handle error
          } else {
            const eth = new Eth(transport);
            const conf = await eth.getAppConfiguration();
            console.log("Current Ethereum app version is:", conf.version);
          }
        } finally {

          if (transport) await transport.close();
          console.log("Closed transport!");
        }
      });

      await openApp(transport, ETHEREUM_APP_NAME);

      console.log("openApp succeeded");
    }
  } catch (err) {
    console.log("Caught error:", err);
  } finally {
    if (transport) await transport.close();
    console.log("Closed transport!");
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>3&nbsp;Almafa</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Click on the button to test stuff
        </p>
        <button onClick={HelloWorldEventDriven}>Clickety-click!</button>
      </header>
    </div>
  );
}

export default App;
