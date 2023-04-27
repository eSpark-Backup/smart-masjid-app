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
import { IqamahTime, JummahTime } from '../../types/masjidControllerTypes';

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

interface ConvertedData {
  heading: string;
  values: (string | null)[];
}

/**
 * Converts an array of IqamahTime and JummahTime objects into an array of ConvertedData objects
 * @param arr Array of IqamahTime and JummahTime objects
 * @returns Array of ConvertedData objects
 */
function convertResponseToData(
  arr: (IqamahTime & JummahTime)[],
): ConvertedData[] {
  const data = arr.reduce<ConvertedData[]>((acc, curr: any) => {
    const keys = Object.keys(curr);

    // loop through each key of the current object
    keys.forEach(key => {
      // check if the key is not one of the unwanted keys
      if (
        key !== 'id' &&
        key !== 'type' &&
        key !== 'createdBy' &&
        key !== 'createdDate' &&
        key !== 'fajrDelay' &&
        key !== 'dhuhrDelay' &&
        key !== 'ishaDelay' &&
        key !== 'asrDelay'
      ) {
        // find the index of the key in the accumulator array
        const index = acc.findIndex(
          item => item.heading === key.charAt(0).toUpperCase() + key.slice(1),
        );

        // get the value of the key and slice it to remove the seconds part
        var value = null;

        const currValue = curr[key];

        if (typeof currValue === 'string') {
          // check if it is a valid date string
          const dateValue = new Date(currValue);
          if (isNaN(dateValue.getTime())) {
            // it is not a valid date string, so leave it as is
            value = currValue?.slice(0, -3);
          } else {
            // it is a valid date string, so extract the date part
            value = dateValue.toISOString().slice(0, 10);
          }
        } else if (currValue instanceof Date) {
          // it is a Date object, so extract the date part
          value = currValue.toISOString().slice(0, 10);
        } else {
          // it is neither a string nor a Date object, so leave it as is
          value = currValue;
        }

        // if the key already exists in the accumulator array, push the value to its values array
        if (index > -1) {
          acc[index].values.push(value ?? '-');
        }
        // otherwise, add a new object to the accumulator array
        else {
          acc.push({
            heading: key?.charAt(0)?.toUpperCase() + key?.slice(1),
            values: [value ?? '-'],
          });
        }
      }
    });

    return acc;
  }, []);

  return data;
}

export {
  _getPhoneId,
  _getFCMToken,
  _requestUserPermission,
  setDataInLocalStorage,
  getDataFromLocalStorage,
  removeDatafromLocalStorage,
  getCurrentMonthAdhanData,
  convertResponseToData,
};
