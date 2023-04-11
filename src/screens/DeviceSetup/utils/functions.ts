import BleManager from 'react-native-ble-manager';

export async function _startBluetooth() {
  await BleManager.start({ showAlert: false });
  console.log('Ble Module Intialized');
}
