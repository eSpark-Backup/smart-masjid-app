import { DeviceEventEmitter } from 'react-native';
//@ts-ignore
import RNSettings from 'react-native-settings';

export function _startLocationCheck(callback: (e: Event) => void) {
  DeviceEventEmitter.addListener(RNSettings.GPS_PROVIDER_EVENT, callback);
}

export function _stopLocationCheck() {
  DeviceEventEmitter.removeAllListeners(RNSettings.GPS_PROVIDER_EVENT);
  console.log('stopped checking location!');
}
