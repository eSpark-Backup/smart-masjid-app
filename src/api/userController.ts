import Toast from 'react-native-toast-message';

import { api } from '.';
import {
  RequestRegisterPhone,
  UserResponse,
} from '../types/userControllerApiResponse';
import { userStore } from '../store/UserStore';
import {
  removeDatafromLocalStorage,
  setDataInLocalStorage,
} from '../utils/functions';
import { globalStore } from '../store/GlobalStates';

/**
 *
 * @description Registering User Phone Device in Server
 */
export const RegisterUserPhone = async (
  data: RequestRegisterPhone,
  userId: string,
): Promise<void> => {
  try {
    await api.post(`/users/${userId}/phones`, data);
  } catch (error) {
    console.log('error RegisterUserPhone', error, 'Request', data, userId);
  }
};

/**
 *
 * @description Login User
 * @returns get data of user and save to userStore
 */
export const LogoutUser = async (userId: string) => {
  try {
    const res = await api.put(`/users/${userId}/logout`, {
      phoneDeviceId: globalStore.phoneId?.get(),
    });
    await removeDatafromLocalStorage('user');
    userStore.userData.set(null);
  } catch (error) {
    console.log('error LogoutUser', error);
  }
};

/**
 *
 * @description Update the user data from profile screen
 * @returns get data of user and save to userStore
 */
export const UpdateUser = async ({
  id,
  data,
}: {
  id: string;
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}) => {
  try {
    const result: any = await api.put<UserResponse>(`/users/${id}`, data);
    if (result.data && result.status == 200) {
      userStore.userData.set(result.data);
      await setDataInLocalStorage('user', JSON.stringify(result.data));
      Toast.show({
        text2: 'User Updated Successfully',
        type: 'success',
      });
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
    return result.data;
  } catch (error) {
    console.log('error UpdateUser', error, 'Request', data);
  }
};

/**
 *
 * @description Get Masjid Admins by masjid is
 * @returns get data of Masjid Admins and save to userStore
 */
export const GetMasjidAdmins = async (id: string) => {
  try {
    const result: any = await api.get(`/users/masjid/${id}`);
    if (result.data && result.status === 200) {
      userStore.masjidAdmins.set(result.data);
    }
  } catch (error) {
    console.log('GetMasjidAdmins error', error);
  }
};

/**
 *
 * @description Delete Admin from Masjid
 * @returns returns message whether success or error
 */
export const DeleteAdminFromMasjid = async (
  userId: string,
  masjidId: string,
) => {
  try {
    const result: any = await api.delete(`/users/${userId}/masjid/${masjidId}`);
    if (result.status === 200) {
      Toast.show({
        text2: 'Admin removed from the masjid',
        type: 'success',
      });
      GetMasjidAdmins(masjidId);
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {}
};

/**
 *
 * @description Add Admin into Masjid
 * @returns returns message whether success or error
 */
export const AddAdminIntoMasjid = async (userId: string, masjidId: string) => {
  try {
    const result: any = await api.post(`/users/${userId}/masjid/${masjidId}`);
    if (result.status === 200) {
      Toast.show({
        text2: 'Admin added to the masjid',
        type: 'success',
      });
      GetMasjidAdmins(masjidId);
      return true;
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
      return false;
    }
  } catch (error) {}
};
