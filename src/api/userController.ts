import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';

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
 * Update user's login status on the server.
 *
 * @param phoneDeviceId - The data to be sent for phone device registration.
 * @param userId - The user's ID.
 * @returns A promise that resolves when the registration is successful or rejects if there is an error.
 */
export const UpdateUserLogin = async (
  phoneDeviceId: string,
  userId: string | number,
) => {
  try {
    const login: any = await api.put(`/users/${userId}/login`, {
      phoneDeviceId: phoneDeviceId,
    });
    if (login.ok) {
      return login;
    } else if (login.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: login.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log(
      'error UpdateUserLogin',
      error,
      'Request',
      phoneDeviceId,
      userId,
    );
  }
};

/**
 * Register a user's phone device on the server.
 *
 * @param data - The data to be sent for phone device registration.
 * @param userId - The user's ID.
 * @returns A promise that resolves when the registration is successful or rejects if there is an error.
 */
export const RegisterUserPhone = async (
  data: RequestRegisterPhone,
  userId: string,
) => {
  try {
    const res: any = await api.post(`/users/${userId}/phones`, data);
    if (res.ok) {
      return res;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: res.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error RegisterUserPhone', error, 'Request', data, userId);
  }
};

/**
 * Update or add a registered user's phone device on the server.
 *
 * @param fcmToken - The FCM token associated with the phone device.
 * @param userId - The user's ID.
 * @param phoneDeviceId - The ID of the phone device to update/add.
 * @returns A promise that resolves when the update/add operation is successful or rejects if there is an error.
 */
export const updateUserPhone = async (
  fcmToken: string,
  userId: string,
  phoneDeviceId: string,
) => {
  try {
    const res: any = await api.put(`/users/${userId}/phones/${phoneDeviceId}`, {
      fcmToken: fcmToken,
    });
    if (res.ok) {
      return res;
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: res.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log(
      'error UpdateUserPhone',
      error,
      'Request',
      { fcmToken },
      userId,
    );
  }
};

/**
 * Log out a user and perform necessary cleanup.
 *
 * @param userId - The ID of the user to log out.
 * @returns A promise that resolves when the user is successfully logged out or rejects if there is an error.
 */
export const LogoutUser = async (userId: string) => {
  try {
    await api.put(`/users/${userId}/logout`, {
      phoneDeviceId: globalStore.phoneId?.get(),
    });
    await removeDatafromLocalStorage('user');
    userStore.userData.set(null);
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error LogoutUser', error);
  }
};

/**
 * Delete a user's account and associated data from the database.
 *
 * @param userId - The ID of the user to be deleted.
 * @returns A promise that resolves when the user's account and data are successfully deleted or rejects if there is an error.
 */

export const DeleteUser = async (userId: string) => {
  try {
    const res: any = await api.delete(`/users/${userId}`);
    console.log('res=>>>>', res);

    if (res.ok) {
      await removeDatafromLocalStorage('user');
      userStore.userData.set(null);
    } else if (res.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: res.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error DeleteUser', error);
  }
};

/**
 * Update user data from the profile screen.
 *
 * @param id - The ID of the user whose data is to be updated.
 * @param data - An object containing the user data to update. Fields that can be updated include: firstName, lastName, email, and phone.
 * @param [data.firstName] - The user's updated first name.
 * @param [data.lastName] - The user's updated last name.
 * @param [data.email] - The user's updated email address.
 * @param [data.phone] - The user's updated phone number.
 * @returns A promise that resolves with the updated user data if the update is successful, or undefined if there is an error.
 */

export const UpdateUser = async (
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  },
) => {
  try {
    const result: any = await api.put<UserResponse>(`/users/${id}`, data);
    if (result.data && result.status == 200) {
      userStore.userData.set(result.data);
      await setDataInLocalStorage('user', JSON.stringify(result.data));
      Toast.show({
        text2: 'User Updated Successfully',
        type: 'success',
      });
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        visibilityTime: 10000,
      });
    }
    return result.data;
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error UpdateUser', error, 'Request', data);
  }
};

/**
 * Get Masjid Admins by masjid ID and save the data to the userStore.
 *
 * @param {string} id - The ID of the masjid for which to retrieve the administrators.
 * @returns A promise that resolves when the data is successfully retrieved and saved to the userStore.
 */
export const GetMasjidAdmins = async (id: string) => {
  try {
    const result: any = await api.get(`/users/masjid/${id}`);
    if (result.data && result.status === 200) {
      userStore.masjidAdmins.set(result.data);
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
    console.log('GetMasjidAdmins error', error);
  }
};

/**
 * Delete an Admin from a Masjid and display a success or error message.
 *
 * @param userId - The ID of the user to be removed as an admin.
 * @param masjidId - The ID of the masjid from which the admin will be removed.
 * @returns A promise that resolves when the admin is successfully removed or displays an error message.
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
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Add an Admin to a Masjid and display a success or error message.
 *
 * @param userId - The ID of the user to be added as an admin.
 * @param masjidId - The ID of the masjid to which the admin will be added.
 * @returns A promise that resolves to `true` when the admin is successfully added or `false` if there's an error.
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
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
      return false;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Get Users of category masjid and display a success or error message.
 *
 * @returns A promise that resolves to `true` when the admin is successfully added or `false` if there's an error.
 */
export const GetUserTypes = async () => {
  try {
    console.log('usertypes result');
    const result: any = await api.get(`/users/type?category=masjid`);
    console.log('usertypes results', result);

    if (result.status === 200) {
      userStore.userRoles.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message,
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};
