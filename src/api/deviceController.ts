import Toast from 'react-native-toast-message';

import { api } from '.';
import { userStore } from '../store/UserStore';
import { DeviceInfo } from '../types';

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
      macAddress: mac_address + '2', //FIXME: delete this hardcoded string later
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
