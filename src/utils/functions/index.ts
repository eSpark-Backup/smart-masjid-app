import { getUniqueId } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStore } from '../../store/GlobalStates';
import { IPrayerTimeForPeriod } from '../../types';
import moment from 'moment';

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

function getCurrentMonthAdhanData(): IPrayerTimeForPeriod[] {
  const prayerTimings = [
    {
      id: 0,
      date: '2023-04-03',
      fajr: {
        hour: 5,
        minute: 50,
        second: 0,
        nano: 0,
      },
      dhuhr: {
        hour: 1,
        minute: 0,
        second: 0,
        nano: 0,
      },
      asr: {
        hour: 4,
        minute: 50,
        second: 0,
        nano: 0,
      },
      maghrib: {
        hour: 5,
        minute: 50,
        second: 0,
        nano: 0,
      },
      isha: {
        hour: 6,
        minute: 50,
        second: 0,
        nano: 0,
      },
      updatedDate: '2023-04-03T10:54:40.945Z',
      fajrCalled: true,
      dhuhrCalled: true,
      asrCalled: true,
      maghribCalled: true,
      ishaCalled: true,
    },
  ];

  const monthPrayerTimings = [];

  const dates = [];
  let currentDate = new Date();
  let endDate = moment().add(1, 'month').toDate();
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]); // April 4th plus the current day number
    const dateString = date.toISOString().slice(0, 10);
    const prayerTiming = JSON.parse(JSON.stringify(prayerTimings[0])); // create a deep copy of the first day's timings object
    prayerTiming.date = dateString;
    prayerTiming.id = i;
    monthPrayerTimings.push(prayerTiming);
  }

  return monthPrayerTimings;
}

export {
  _getPhoneId,
  _getFCMToken,
  _requestUserPermission,
  setDataInLocalStorage,
  getDataFromLocalStorage,
  removeDatafromLocalStorage,
  getCurrentMonthAdhanData,
};
