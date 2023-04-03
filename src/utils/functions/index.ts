import { getUniqueId } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStore } from '../../store/GlobalStates';

/**
 *
 * @description Used to get the phone's unique id
 * @returns Promise<string>
 * @todo //todo: Delete This later
 */

async function _getPhoneId(): Promise<string> {
  const res = await getUniqueId();
  return res;
}

/**
 *
 * @description Used to get the device FCM Token
 * @returns Promise<string>
 * @todo //todo: Delete This later
 */

async function _getFCMToken(): Promise<string> {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
  // Get the token
  const fcmToken = await messaging().getToken();
  globalStore.fcmToken.set(fcmToken);
  return fcmToken;
}

/**
 *
 * @description Used to requestPermission method which triggers a native permission dialog requesting the user's permission:
 * @returns null
 * @todo //todo: Delete This later
 */
async function _requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  checkMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS]).then(statuses => {
    if (statuses[PERMISSIONS.ANDROID.POST_NOTIFICATIONS] != 'granted') {
      requestMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS]);
    }
  });
}

/**
 *
 * @description get key and value from parameters and save it to asyncstorage
 * @returns null
 * @todo //todo: Delete This later
 */
async function setDataInLocalStorage(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 *
 * @description get data from asyncStorage for specific key
 * @returns data
 * @todo //todo: Delete This later
 */
async function getDataFromLocalStorage(key: string) {
  try {
    const result = await AsyncStorage.getItem(key);
    return result;
  } catch (e) {
    return false;
  }
}

/**
 *
 * @description remove data from asyncstorage of given key
 * @returns boolean
 * @todo //todo: Delete This later
 */
 async function removeDatafromLocalStorage(key: string) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export {
  _getPhoneId,
  _getFCMToken,
  _requestUserPermission,
  setDataInLocalStorage,
  getDataFromLocalStorage,
  removeDatafromLocalStorage
};
