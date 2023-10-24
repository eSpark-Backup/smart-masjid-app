import {
  Platform,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {
  check,
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  request,
  requestMultiple,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import phone from 'phone';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';

import { globalStore } from '../../store/GlobalStates';
import { CountryCodes, IPrayerTimeForPeriod } from '../../types';
import {
  IqamahTime,
  JummahTime,
  SubscriptionList,
} from '../../types/masjidControllerTypes';

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
  if (
    Platform.OS == 'android' &&
    !messaging().isDeviceRegisteredForRemoteMessages
  ) {
    await messaging().registerDeviceForRemoteMessages();
  }
  let token = '';
  if (Platform.OS == 'ios') {
    const apnsToken = await AsyncStorage.getItem('apns');
    console.log('apnsToken', apnsToken);
    await messaging().registerDeviceForRemoteMessages();
    messaging().setAutoInitEnabled(true);
    if (!apnsToken) {
      const apns = await messaging().getAPNSToken();
      await AsyncStorage.setItem('apns', apns ?? '');
      console.log('sx getAPNSToken', apns);
      await messaging().setAPNSToken(apns ?? '');
      token = await messaging().getToken();
      console.log('token ', token);
      globalStore.fcmToken.set(token);
    } else {
      await messaging().setAPNSToken(apnsToken ?? '');
      token = await messaging().getToken();
      console.log('token ', token);
      globalStore.fcmToken.set(token);
    }
  } else {
    // Get the token
    token = await messaging().getToken();
    console.log('token', token);
    globalStore.fcmToken.set(token);
  }
  return token;
}

/**
 *
 * @description Used to requestPermission method which triggers a native permission dialog requesting the user's permission:
 * @returns null
 * @todo //todo: Delete This later
 */
async function _requestUserNotificationPermission() {
  if (Platform.OS == 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      Toast.show({
        text1: 'Authorization status',
        text2: authStatus?.toString(),
        type: 'success',
        visibilityTime: 19000,
      });
      _getFCMToken();
    }
  } else {
    checkMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS]).then(statuses => {
      console.log(
        'kia ha notification status ' +
          statuses['android.permission.POST_NOTIFICATIONS'],
      );
      if (statuses['android.permission.POST_NOTIFICATIONS'] == 'blocked') {
        _openSettingIsBlocked(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      }
      if (statuses[PERMISSIONS.ANDROID.POST_NOTIFICATIONS] != 'granted') {
        requestMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS]);
      }
    });
  }
}

/**
 * @description Used to request Location Permission method which triggers a native permission dialog requesting the user's permission:
 * @returns null
 * @todo //todo: Delete This later
 */
async function _requestUserLocationPermission() {
  checkMultiple([
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.IOS.LOCATION_ALWAYS,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  ]).then(statuses => {
    if (Platform.OS == 'android') {
      ToastAndroid.show('Enable Location Permission', 8000);
    }
    _openSettingIsBlocked(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    _openSettingIsBlocked(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    _openSettingIsBlocked(PERMISSIONS.IOS.LOCATION_ALWAYS);
    _openSettingIsBlocked(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (
      statuses[
        (PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      ] != 'granted'
    ) {
      requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]);
    }
  });
}

/**
 * @description If Given Permission is Blocked so It open Setting Otherwise ask permission
 */
async function _openSettingIsBlocked(permission: Permission) {
  check(permission).then(statuses => {
    console.log('statuses', statuses);
    console.log('denied', PermissionsAndroid.RESULTS.DENIED);

    if (
      Platform.OS == 'android' &&
      statuses == PermissionsAndroid.RESULTS.DENIED
    ) {
      openSettings();
      return;
    } else if (Platform.OS == 'ios' && statuses == 'blocked') {
      openSettings();
      return;
    }
    request(permission);
  });
}

/**
 *
 * @description Used to requestPermission for Ble and Location for Using ble scan and connection
 * @returns Promise<Boolean>
 * @todo //todo: Delete This later
 */
async function _requestBlePermissions(): Promise<Boolean> {
  if (Platform.OS == 'ios') {
    return true;
    // const checkStatus = await checkMultiple([
    //   PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    // ]);
    // console.log('hello', checkStatus);
    // if (
    //   checkStatus[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] !== 'granted' ||
    //   checkStatus[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] === 'denied'
    // ) {
    //   const requestStatus = await requestMultiple([
    //     PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    //   ]);
    //   return requestStatus[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] === 'granted';
    // } else {
    //   return true;
    // }
  } else {
    const checkStatus = await checkMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      // PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    console.log('hello', checkStatus);
    if (
      checkStatus[
        (PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)
      ] !== 'granted' ||
      checkStatus[
        (PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)
      ] === 'denied'
    ) {
      const requestStatus = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      ]);
      return (
        requestStatus[
          (PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)
        ] === 'granted'
      );
    } else {
      return true;
    }
  }
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
  } catch (error) {
    crashlytics().recordError(error as Error);
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
  } catch (error) {
    crashlytics().recordError(error as Error);
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
  } catch (error) {
    crashlytics().recordError(error as Error);
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
        const index = acc.findIndex(item => {
          return item.heading === key?.charAt(0)?.toUpperCase() + key?.slice(1);
        });

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
            // value = dateValue.toISOString().slice(0, 10);
            // value = moment(dateValue).format('DD/MM/YYYY');
            value = moment(currValue, 'YYYY-MM-DD').format('DD/MM/YYYY');
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

async function isValidPhoneNumber(phoneNum: string, country?: CountryCodes) {
  // return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(number);
  try {
    if (Boolean(phoneNum) != false) {
      const isPhoneValid = phone(phoneNum, { country: country?.iso_code });
      if (!isPhoneValid.isValid) {
        Toast.show({
          text2: 'Phone number is not valid',
          type: 'error',
          visibilityTime: 10000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (e) {
    crashlytics().recordError(e as Error);
  }
}

/**
 * Converts an 24H Format Time into 12H Format
 * @param time Only 5 digits Time like 15:15
 * @returns Time Only like 03:15 PM
 */

function convertTo12Hour(time: string) {
  if (time.length == 5) {
    var str = new Date().toString().split('');
    str.splice(16, 5, time);
    var modifiedStr = str.join('');
    return moment(modifiedStr).format('LT');
  } else {
    return time;
  }
}

interface NormalizedSubscriptions {
  [category: string]: SubscriptionList[];
}

function _normalizedSubscriptions(subscriptions?: SubscriptionList[]) {
  return subscriptions?.reduce((acc, subscription) => {
    const category: string =
      subscription.subscriptionType.subscriptionCategory.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(subscription);
    return acc;
  }, {} as NormalizedSubscriptions);
}

async function openMap(lat: string, long: string) {
  // const destination = encodeURIComponent(`${address} ${zipCode}, ${city}`);
  const destination = encodeURIComponent(`${lat},${long}`);
  const provider = Platform.OS === 'ios' ? 'apple' : 'google';
  const link = `http://maps.${provider}.com/?daddr=${destination}`;
  try {
    const supported = await Linking.canOpenURL(link);

    if (supported) Linking.openURL(link);
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log(error);
  }
}

export {
  _getPhoneId,
  _getFCMToken,
  _requestUserNotificationPermission,
  _requestUserLocationPermission,
  _requestBlePermissions,
  setDataInLocalStorage,
  getDataFromLocalStorage,
  removeDatafromLocalStorage,
  getCurrentMonthAdhanData,
  convertResponseToData,
  isValidPhoneNumber,
  convertTo12Hour,
  _normalizedSubscriptions,
  openMap,
};
