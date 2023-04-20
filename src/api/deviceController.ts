import { api } from '.';
import { deviceStore } from '../store/DeviceStore';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
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
    const result: any = await api.post(`/devices/${deviceId}/masjid/${masjidId}`);
    console.log("result", result);
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
