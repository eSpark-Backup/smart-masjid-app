import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '.';
import { deviceStore } from '../store/DeviceStore';
import { DeviceInfo } from '../types';
import { userStore } from '../store/UserStore';
import { Device } from '../types/deviceControllerTypes';
import { masjidStore } from '../store/MasjidStore';

/**
 *
 * @description Get User Devices
 * @returns get devices and save to deviceStore.devices
 */
export const GetUserDevices = async (userId: string) => {
  try {
    const result: any = await api.get(`/devices/user/${userId}`);
    if (result.status == 200) {
      deviceStore.devices.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Get Masjid Devices
 * @returns get devices and save to deviceStore.masjidDevices
 */
export const GetMasjidDevices = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/devices/masjid/${masjidId}`);
    if (result.status == 200) {
      deviceStore.masjidDevices.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

export const SubscribeMasjid = async (deviceId: string, masjidId: string) => {
  try {
    const result: any = await api.post(
      `/devices/${deviceId}/masjid/${masjidId}`,
    );
    console.log('result', result);
    if (result.status == 200 && result.data) {
      return true;
    } else {
      Toast.show({
        text1: result?.data?.message ?? 'Something went wrong',
      });
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

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
    } else {
      Toast.show({
        text1: result?.data?.message ?? 'Something went wrong',
      });
      return false;
    }
  } catch (error) {}
};

/**
 *
 * @description Check's Device Telemetry on Device Id
 * @returns Promise<boolean>
 * @todo //todo: Delete This later
 */

export async function _checkDeviceTelemetry(deviceId: string) {
  console.log('now checking device Telemetry for Deivce id =>', deviceId);
  try {
    const res = await api.get<any>(`devices/${deviceId}/telemetry`);
    if (res?.ok) {
      console.log('Gotten Telemetry', res.data);
      if (res.data?.status == 'Online') {
        return true;
      } else {
        return false;
      }
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
 *
 * @description Registers Device on the Server's DataBase
 * @returns Promise<DeviceResponse>
 * @todo //todo: Delete This later
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
 *
 * @description Assigns Device on the Server's DataBase to the Given User
 * @returns Promise<DeviceResponse>
 * @todo //todo: Delete This later
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
 *
 * @description Assigns Device on the Server's DataBase to the Given Masjid
 * @returns Promise<DeviceResponse>
 * @todo //todo: Delete This later
 */

export async function _saveDeviceBtnToMasjid(devID: number, masjidID: number) {
  try {
    const res = await api.post('devices/' + devID + '/masjid/' + masjidID);
    if (res?.ok) {
      console.log('Success device assigned to masjid');
      if (res.data) return res.data;
    } else {
      console.log('Problem status', res.status, res.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when saving device to masjid', error);
  }
}

/**
 *
 * @description Update Device on the Server's DataBase
 * @returns Promise<DeviceResponse>
 * @todo //todo: Delete This later
 */

export async function _updateDevice(devInfo: Device) {
  const { id, firmwareVersion, name, wifiSsid, deviceTelemetry } = devInfo;
  console.log('Device info in api???', devInfo);
  try {
    const res = await api.put<any>('devices/' + id, {
      name: name,
      firmwareVersion: firmwareVersion,
      wifiSsid: wifiSsid,
      status: deviceTelemetry.status,
    });
    if (res?.ok) {
      console.log('Success', res.data);
      Toast.show({
        text2: 'Device details updated successfully',
        type: 'success',
      });
      if (res.data) return res.data;
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
 *
 * @description Check's Device Telemetry on Device Id
 * @returns Promise<boolean>
 * @todo //todo: Delete This later
 */

export async function _resetDevice(deviceId: string) {
  console.log('Deleting Device now =>', deviceId);
  try {
    const res = await api.delete<any>(`devices/${deviceId}/reset`);
    if (res?.ok) {
      console.log('Deleted Success', Boolean(res.data));
      return true;
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
