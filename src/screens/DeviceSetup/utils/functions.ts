import {
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import BleManager, {
  Peripheral,
  PeripheralInfo,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import crashlytics from '@react-native-firebase/crashlytics';

//@ts-ignore
import RNSettings from 'react-native-settings';
//@ts-ignore
import { bytesToString, stringToBytes } from 'convert-string';

import { DeviceInfo } from '../../../types';

const SECONDS_TO_SCAN_FOR = 10;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export async function _startBluetooth() {
  try {
    await BleManager.start({ showAlert: false });
    console.log('Ble Module Intialized');
  } catch (e) {
    console.log('error at bluetooth start', e);
  }
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
  try {
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
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}

export function _checkLocationStatus() {
  try {
    return new Promise((resolve: (value: boolean) => any, reject) => {
      RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
        if (result == RNSettings.ENABLED) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}

export async function _scanBleDevices(time?: number) {
  try {
    await BleManager.scan(
      SERVICE_UUIDS,
      time ?? SECONDS_TO_SCAN_FOR,
      ALLOW_DUPLICATES,
      {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      },
    );
    // Success code
    console.log('Scan started');
    return new Promise((resolve: (value: Peripheral[]) => any, reject) => {
      setTimeout(() => {
        BleManager.getDiscoveredPeripherals()
          .then(peripheralsArray => {
            // Success code
            Platform.OS == 'ios'
              ? resolve(peripheralsArray)
              : resolve(peripheralsArray);
          })
          .catch(error => {
            crashlytics().recordError(error as Error);
            reject(error);
          });
      }, SECONDS_TO_SCAN_FOR * 1000);
    });
  } catch (e) {
    console.log('caught at scan and discover', e);
  }
}

export async function _connectBleDevice(devInfo: DeviceInfo) {
  try {
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
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}

export async function _disconnectBleDevice(
  devInfo: DeviceInfo,
  isOnline?: boolean,
) {
  console.log('Disconnect Crashing why??????');
  try {
    if (isOnline) {
      return;
    }
    if (!devInfo.macId) {
      const peripheralsArray = await BleManager.getConnectedPeripherals([]);
      console.log('Connected peripherals: ' + JSON.stringify(peripheralsArray));

      const dev: Peripheral | undefined = peripheralsArray.find(
        item => item.name?.includes('SMSPK') || item.name?.includes('SMBTN'),
      );

      if (dev) {
        await BleManager.disconnect(dev.id);
        console.log('Disconnected from Connected');
      }
    } else {
      await BleManager.disconnect(devInfo.macId);
      console.log('Disconnected');
    }
  } catch (error) {
    // Handle errors appropriately
    console.error('Error:', error);
    crashlytics().recordError(error as Error);
  }
}

export async function _readFromDevice(
  devInfo: DeviceInfo,
  serviceUUID: string,
  charUUID: string,
) {
  try {
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
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}

export async function _writeToDevice(
  devInfo: DeviceInfo,
  serviceUUID: string,
  charUUID: string,
  isBtn: boolean,
) {
  try {
    // return new Promise((resolve, reject) => {
    let dat: any = {
      ssid: devInfo?.ssid,
      pass: devInfo?.password,
    };
    if (isBtn) {
      dat.masjid_id = devInfo?.masjid_id;
    }

    const string = JSON.stringify(dat);

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
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}
