import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '.';
import { deviceStore } from '../store/DeviceStore';
import { DeviceInfo } from '../types';
import { userStore } from '../store/UserStore';
import { Device } from '../types/deviceControllerTypes';
import { masjidStore } from '../store/MasjidStore';
import { LogoutUser } from './userController';

/**
 * Get devices associated with a user.
 *
 * @param userId - The ID of the user for whom to retrieve devices.
 * @returns A promise of `void`
 */

export const GetUserDevices = async (userId: string) => {
  try {
    const result: any = await api.get(`/devices/user/${userId}`);
    if (result.status == 200) {
      deviceStore.devices.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Get devices associated with a masjid.
 *
 * @param masjidId - The ID of the masjid for which to retrieve devices.
 * @returns A promise of `void`
 */

export const GetMasjidDevices = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/devices/masjid/${masjidId}`);
    if (result.status == 200) {
      deviceStore.masjidDevices.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Subscribe a device to a masjid.
 *
 * @param deviceId - The ID of the device to subscribe.
 * @param masjidId - The ID of the masjid to which the device will be subscribed.
 * @returns A promise that resolves to `true` if the device was successfully subscribed to the masjid, or rejects if there was an error.
 */

export const SubscribeMasjid = async (deviceId: string, masjidId: string) => {
  try {
    const result: any = await api.post(
      `/devices/${deviceId}/masjid/${masjidId}`,
    );
    console.log('result', result);
    if (result.status == 200 && result.data) {
      return true;
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Unsubscribe a device from a masjid.
 *
 * @param deviceId - The ID of the device to unsubscribe.
 * @param masjidId - The ID of the masjid from which to unsubscribe the device.
 * @returns A promise that resolves to `true` if the device was successfully unsubscribed from the masjid, or rejects if there was an error.
 */

export const unSubscribeMasjid = async (deviceId: string, masjidId: string) => {
  try {
    const result: any = await api.delete(
      `/devices/${deviceId}/masjid/${masjidId}`,
    );
    console.log('result', result);
    if (result.status == 200 && result.data) {
      return true;
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Get devices associated with a user and, optionally, a masjid.
 *
 * @param userId - The ID of the user for whom to retrieve devices.
 * @param masjidId - Optional. The ID of the masjid for which to retrieve devices.
 * @returns A promise that resolves if the retrieval is successful, or rejects if there was an error.
 */

export const GetMasjidDevicesForUser = async (
  userId: string,
  masjidId?: string,
) => {
  try {
    const result: any = await api.get(
      `/devices/user/${userId}/masjid/${masjidId}`,
    );
    // console.log('resultxxx', result);
    if (result.status == 200 && result.data) {
      masjidStore.connectedDevices.set(result.data);
      return result.data;
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Checks device telemetry for a given device.
 *
 * @param deviceId - The ID of the device to check telemetry for.
 * @param [checkTime] - Optional. If `true`, returns the telemetry data; if `false`, checks if the device status is 'Online'.
 * @returns A `Promise` that resolves to `true` if the device is 'Online' (when `checkTime` is `false`) or the telemetry data (when `checkTime` is `true`), or rejects with an error if there was a problem.
 */

export async function _checkDeviceTelemetry(
  deviceId: string,
  checkTime?: boolean,
) {
  console.log('now checking device Telemetry for Deivce id =>', deviceId);
  try {
    const res = await api.get<any>(`devices/${deviceId}/telemetry`);
    if (res?.ok) {
      if (checkTime) {
        console.log('Gotten Telemetry', res.data);
        return res?.data;
      } else {
        if (res.data?.status == 'Online') {
          console.log('Online');
          return true;
        } else {
          console.log('Offline');
          return false;
        }
      }
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      console.log('Problem status', res.status, res.data);
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when device exists problems', error);
    return false;
  }
}

/**
 * Saves device information.
 *
 * @param devInfo - The device information to save.
 * @returns A promise that resolves if the device information was successfully saved, or rejects with an error if there was a problem.
 */

export async function _saveDevice(devInfo: DeviceInfo) {
  const { device_model, firmware_rev, nickName, mac_address, ssid } = devInfo;
  console.log('Device info in api???', devInfo);
  try {
    const res = await api.post<any>('devices', {
      macAddress: mac_address,
      name: nickName,
      modelNumber: device_model,
      firmwareVersion: firmware_rev,
      wifiSsid: ssid,
    });
    if (res?.ok) {
      console.log('Success', res.data);
      if (res.data) return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: res?.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
      console.log('Problem status when device save', res.status, res.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    Toast.show({
      text2: 'Something went wrong',
      type: 'error',
      autoHide: true,
      visibilityTime: 10000,
    });
    console.log('when registering device', error);
  }
}

/**
 * Saves a device to a user.
 *
 * @param devID - The ID of the device to save to the user.
 * @returns A promise that resolves if the device was successfully assigned to the user, or rejects with an error if there was a problem.
 */

export async function _saveDeviceToUser(devID: number) {
  if (devID) {
    try {
      const res = await api.post(
        'devices/' + devID + '/user/' + userStore.get().userData?.id,
      );
      if (res?.ok) {
        console.log('Success device assigned to user');
        if (res.data) return res.data;
      } else if (res.status == 401) {
        await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      } else {
        console.log(
          'Problem status when device save to user',
          res.status,
          res.data,
        );
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.log('when saving device with user', error);
    }
  } else {
    Toast.show({
      text2: 'Something went wrong',
      type: 'error',
      autoHide: true,
      visibilityTime: 10000,
    });
  }
}

/**
 * Saves a device button to a masjid.
 *
 * @param devID - The ID of the device to save.
 * @param masjidID - The ID of the masjid to which the device button will be saved.
 * @returns A promise that resolves if the device button was successfully saved to the masjid, or rejects with an error if there was a problem.
 */

export async function _saveDeviceBtnToMasjid(devID: number, masjidID: number) {
  try {
    const res = await api.post('devices/' + devID + '/masjid/' + masjidID);
    if (res?.ok) {
      console.log('Success device assigned to masjid');
      if (res.data) return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      console.log('Problem status', res.status, res.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when saving device to masjid', error);
  }
}

/**
 * Updates device information.
 *
 * @param devInfo - The device information to update, including an optional `wifiPassword`.
 * @returns A promise that resolves if the device information was updated successfully, or rejects with an error if there was a problem.
 */

export async function _updateDevice(
  devInfo: Device & { wifiPassword?: string },
) {
  const { id, firmwareVersion, name, wifiSsid, deviceTelemetry, wifiPassword } =
    devInfo;
  console.log('Device info in api???', {
    name: name,
    firmwareVersion: firmwareVersion,
    wifiSsid: wifiSsid,
    wifiPassword: wifiPassword,
    status: deviceTelemetry.status,
  });
  try {
    const res = await api.put<any>('devices/' + id, {
      name: name,
      firmwareVersion: firmwareVersion,
      wifiSsid: wifiSsid,
      wifiPassword: wifiPassword,
      status: deviceTelemetry.status,
    });
    if (res?.ok) {
      console.log('Success', res.data);
      Toast.show({
        text2: 'Device details updated successfully',
        type: 'success',
      });
      if (res.data) return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: res?.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
      console.log('Problem status when device save', res.problem);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    Toast.show({
      text2: 'Something went wrong',
      type: 'error',
      autoHide: true,
      visibilityTime: 10000,
    });
    console.log('when registering device', error);
  }
}

/**
 * Deletes a device and resets it.
 *
 * @param deviceId - The ID of the device to reset.
 * @returns A promise that resolves if the device was deleted and reset successfully, or rejects with an error if there was a problem.
 */

export async function _resetDevice(deviceId: string) {
  console.log('Deleting Device now =>', deviceId);
  try {
    const res = await api.delete<any>(`devices/${deviceId}/reset`);
    if (res?.ok) {
      console.log('Deleted Success', Boolean(res.data));
      return true;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      console.log('Problem status', res.status, res.data);
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when device exists problems', error);
    return false;
  }
}

/**
 * Get device subscriptions.
 * @param deviceId - The ID of the device.
 * @returns A `Promise` that resolves to an array of subscriptions if successful, or `false` if there was an error.
 */

export async function getDeviceSubscriptions(deviceId: string) {
  console.log('Deleting Device now =>', deviceId);
  try {
    const res = await api.get<any>(`/devices/${deviceId}/subscriptions`);
    if (res?.ok) {
      return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      console.log('Problem status', res.status, res.data);
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when getting device subscriptions problems', error);
    return false;
  }
}

/**
 * @description Subscribe, unsubscribed ADHAN Timing
 * @param deviceId - The ID of the device.
 * @param subscriptionId - The ID of the subscription to add.
 * @returns A `Promise` that resolves to a `DeviceInfo` object if successful, `null` if there was an error, or `false` if there was a catch error.
 */

export async function addSubscription(
  deviceId: string,
  subscriptionId: string,
) {
  try {
    const res = await api.post<any>(
      `/devices/${deviceId}/subscription/${subscriptionId}`,
    );
    if (res?.ok) {
      return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      console.log('Problem status', res.status, res.data);
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when getting device subscriptions problems', error);
    return false;
  }
}

/**
 * @description Unsubscribe from a subscribed ADHAN Timing.
 * @param deviceId - The ID of the device.
 * @param subscriptionId - The ID of the subscription to remove.
 * @returns A `Promise` that resolves to a `DeviceInfo` object if successful, or `false` if there was an error.
 */

export async function removeSubscription(
  deviceId: string,
  subscriptionId: string,
) {
  try {
    const res = await api.delete<any>(
      `/devices/${deviceId}/subscription/${subscriptionId}`,
    );
    if (res?.ok) {
      return res.data;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
      return false;
    } else {
      console.log('Problem status', res.status, res.data);
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when getting device subscriptions problems', error);
    return false;
  }
}
