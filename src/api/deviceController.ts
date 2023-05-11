import { api } from '.';
import { deviceStore } from '../store/DeviceStore';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { DeviceInfo } from '../types';
import { userStore } from '../store/UserStore';
/**
 *
 * @description Get User Devices
 * @returns get devices and save to deviceStore
 */
export const GetUserDevices = async (userId: string) => {
  try {
    const result: any = await api.get(`/devices/user/${userId}`);
    if (result.status == 200) {
      deviceStore.devices.set(result.data);
    }
  } catch (error) {}
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
  } catch (error) {}
};

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
    const res = await api.post('devices', {
      macAddress: mac_address + '1e', //FIXME: delete this hardcoded string later
      name: nickName,
      modelNumber: device_model,
      firmwareVersion: firmware_rev,
      wifiSsid: ssid,
    });
    if (res?.ok) {
      console.log('Success', res.data);
      if (res.data) return res.data;
    } else {
      console.log('Problem status', res.status, res.data);
    }
  } catch (e) {
    console.log('when registering device', e);
  }
}

/**
 *
 * @description Assigns Device on the Server's DataBase to the Given User
 * @returns Promise<DeviceResponse>
 * @todo //todo: Delete This later
 */

export async function _saveDeviceToUser(devID: number) {
  try {
    const res = await api.post(
      'devices/' + devID + '/user/' + userStore.get().userData?.id,
    );
    if (res?.ok) {
      console.log('Success device assigned to user');
      if (res.data) return res.data;
    } else {
      res.data;
      console.log('Problem status', res.status, res.data);
    }
  } catch (e) {
    console.log('when saving device with user', e);
  }
}
