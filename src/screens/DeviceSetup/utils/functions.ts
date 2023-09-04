import {
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native';
import BleManager, {
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import crashlytics from '@react-native-firebase/crashlytics';

//@ts-ignore
import RNSettings from 'react-native-settings';
//@ts-ignore
import { bytesToString, stringToBytes } from 'convert-string';

import { DeviceInfo } from '../../../types';

const scanTime = 10;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export async function _startBluetooth() {
  await BleManager.start({ showAlert: false });
  console.log('Ble Module Intialized');
}

export function _startLocationCheck(callback: (e: Event) => void) {
  DeviceEventEmitter.addListener(RNSettings.GPS_PROVIDER_EVENT, callback);
}

export function _stopLocationCheck() {
  DeviceEventEmitter.removeAllListeners(RNSettings.GPS_PROVIDER_EVENT);
}

export function _startCheckBle(callback: (e: Event) => void) {
  BluetoothStateManager.onStateChange(callback, true);
}

export function _checkBleStatus() {
  return new Promise((resolve: (value: boolean) => any, reject) => {
    BleManager.checkState().then(state => {
      console.log(`current BLE state = '${state}'.`);
      if (state == 'on') {
        resolve(true);
      }
      if (state == 'off') {
        resolve(false);
      }
    });
  });
}

export function _checkLocationStatus() {
  return new Promise((resolve: (value: boolean) => any, reject) => {
    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
      if (result == RNSettings.ENABLED) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export async function _scanBleDevices(time?: number) {
  await BleManager.scan([], time ?? scanTime, true);
  // Success code
  console.log('Scan started');
  return new Promise((resolve: (value: Peripheral[]) => any, reject) => {
    setTimeout(() => {
      BleManager.getDiscoveredPeripherals()
        .then(peripheralsArray => {
          // Success code
          resolve(peripheralsArray);
        })
        .catch(error => {
          crashlytics().recordError(error as Error);
          reject(error);
        });
    }, scanTime * 1000);
  });
}

export async function _connectBleDevice(devInfo: DeviceInfo) {
  if (!devInfo.macId) {
    return;
  }
  return new Promise((resolve: (value: PeripheralInfo) => any, reject) => {
    BleManager.connect(devInfo?.macId!!)
      .then(() => {
        // Success code
        console.log('Connected');
        BleManager.retrieveServices(devInfo?.macId!!)
          .then(peripheralInfo => {
            // Success code
            resolve(peripheralInfo);
          })
          .catch(error => {
            reject(error);
            crashlytics().recordError(error as Error);
            console.log('error while retrieve services', error);
          });
      })
      .catch(error => {
        // Failure code
        reject(error);
        crashlytics().recordError(error as Error);
        console.log('error while connecting', error);
      });
  });
}

export async function _disconnectBleDevice(devInfo: DeviceInfo) {
  if (!devInfo.macId) {
    BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
      // Success code
      console.log('Connected peripherals: ' + JSON.stringify(peripheralsArray));
      const dev: Peripheral | undefined = peripheralsArray.find(item =>
        item.name?.includes('MYESP'),
      );
      if (!dev) {
        return;
      }
      BleManager.disconnect(dev?.id)
        .then(() => {
          // Success code
          console.log('Disconnected from Connected');
        })
        .catch(error => {
          // Failure code
          crashlytics().recordError(error as Error);
          console.log('error while disconnecting', error);
        });
    });
  } else {
    BleManager.disconnect(devInfo?.macId!!)
      .then(() => {
        // Success code
        console.log('Disconnected');
      })
      .catch(error => {
        // Failure code
        crashlytics().recordError(error as Error);
        console.log('error while disconnecting', error);
      });
  }
}

export async function _readFromDevice(
  devInfo: DeviceInfo,
  serviceUUID: string,
  charUUID: string,
) {
  return new Promise((resolve: (value: string) => any, reject) => {
    BleManager.read(devInfo?.macId!!, serviceUUID, charUUID)
      .then(readData => {
        // Success code
        const strData = bytesToString(readData);
        resolve(strData);
      })
      .catch(error => {
        // Failure code
        crashlytics().recordError(error as Error);
        console.log(error);
      });
  });
}

export async function _writeToDevice(
  devInfo: DeviceInfo,
  serviceUUID: string,
  charUUID: string,
) {
  // return new Promise((resolve, reject) => {
  const string = JSON.stringify({
    ssid: devInfo?.ssid,
    pass: devInfo?.password,
  });
  const data = stringToBytes(string);
  console.log('device info1', string);
  BleManager.write(devInfo?.macId!!, serviceUUID, charUUID, data, 64)
    .then(async () => {
      // Success code
      console.log('Write Successfully');
    })
    .catch(error => {
      // Failure code
      // reject(error)
      crashlytics().recordError(error as Error);
      console.log(error);
    });
  // });
}
