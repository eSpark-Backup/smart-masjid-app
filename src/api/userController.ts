import Toast from 'react-native-toast-message';

import { api } from '.';
import {
  CreateUserRequest,
  FailCheckPhoneId,
  RequestRegisterPhone,
  SuccessCheckPhoneId,
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
 * @description Check if the user phone id is already registered in the Server
 * @returns Promise<PhoneIdResponse>
 * @todo //todo: Delete This later
 */

type PhoneIdResponse = SuccessCheckPhoneId | FailCheckPhoneId | undefined;

export async function _checkPhoneId(phoneId: string): Promise<PhoneIdResponse> {
  try {
    const res = await api.get<SuccessCheckPhoneId, FailCheckPhoneId>(
      'users/phones/' + phoneId,
    );
    if (res.data) return res.data;
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 * @description Get information from user and registered in the Server
 * @returns get data of user and save to userStore
 */

export const CreateUser = async (
  data: CreateUserRequest,
  otp: string,
): Promise<UserResponse | undefined> => {
  try {
    const result: any = await api.post<UserResponse>(
      '/external/user/account',
      data,
    );
    if (result.status == 200 && result.data) {
      const token: any = await api.post(`/external/auth/token/create`, {
        application: 'MOBILE',
        userId: result.data.id,
        lastOTPVerified: otp,
      });
      userStore.token.set(token?.data?.token);
      userStore.currentRegisterUser.set(result.data);
      api.setHeaders({
        Authorization: `Bearer ${token?.data?.token}`,
      });
      await setDataInLocalStorage('token', JSON.stringify(token?.data?.token));
      return result.data;
    }
  } catch (error) {
    console.log('error CreateUser', error, 'Request', data);
  }
};

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
 * @description Checking User exists with given Email/Phone
 * @returns get data of user and save to userStore
 */
export const LoginUser = async (email: string, phone: string, otp: string) => {
  try {
    const result: any = await api.get(
      `/external/users/exists?email=${email}&phone=${
        phone ? phone.replace('+', '%2B') : ''
      }`,
    );
    console.log('result LoginUser', result);
    if (result.data) {
      const login = await api.put(`/users/${result?.data?.id}/login`, {
        phoneDeviceId: globalStore.phoneId?.get(),
      });
      const token: any = await api.post(`/external/auth/token/create`, {
        application: 'MOBILE',
        userId: result.data.id,
        lastOTPVerified: otp,
      });
      console.log('login', login, '\n', 'token', token);

      userStore.token.set(token?.data?.token);
      api.setHeaders({
        Authorization: `Bearer ${token?.data?.token}`,
      });
      userStore.userData.set(result.data);
      setDataInLocalStorage('user', JSON.stringify(result.data));
      setDataInLocalStorage('token', JSON.stringify(token?.data?.token));
      console.log('token', JSON.stringify(token?.data?.token));
      return result.data;
    } else {
      Toast.show({
        text2: 'User not found',
        type: 'error',
      });
    }
  } catch (error) {
    console.log('error LoginUser', error, 'Request', email);
  }
};

/**
 *
 * @description Checks if the user is exist or not
 * @returns if the user is exist so return user information
 */
export const CheckUserExists = async (email: string, phone: string) => {
  try {
    const result = await api.get(
      `/external/users/exists?email=${email}&phone=${
        phone ? phone.replace('+', '%2B') : ''
      }`,
    );
    console.log('what is ', result);

    if (result.status == 200 && result.data) {
      return result.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log('err CheckUserExists', err);
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
      });
    }
    return result.data;
  } catch (error) {
    console.log('error CreateUser', error, 'Request', data);
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
      });
      return false;
    }
  } catch (error) {}
};

/**
 *
 * @description Send OTP to User
 * @returns returns boolean status whether success or error
 */
export const SendOTP = async (email?: string, phone?: string) => {
  try {
    const result: any = await api.post(`/external/auth/otp/send`, {
      email: email ?? '',
      phone: phone ?? '',
    });
    if (result.status === 200) {
      Toast.show({
        text2: 'OTP sent successfully',
        type: 'success',
      });
      return true;
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
      });
      return false;
    }
  } catch (error) {
    console.log('error SendOTP', error);
  }
};

/**
 *
 * @description Validate OTP
 * @returns returns boolean status whether success or error
 */
export const ValidateOTP = async (
  otp: string,
  email?: string,
  phone?: string,
) => {
  try {
    const result: any = await api.post(`/external/auth/otp/validate`, {
      email: email ?? '',
      phone: phone ?? '',
      otp: otp ?? '',
    });
    console.log('🚀 ~ file: userController.ts:322 ~ phone:', phone);
    console.log('🚀 ~ file: userController.ts:319 ~ result:', result);
    if (result.status === 200 && result.data) {
      Toast.show({
        text2: 'OTP verification successfully',
        type: 'success',
      });
      return true;
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
      });
      return false;
    }
  } catch (error) {
    console.log('error ValidateOTP', error);
  }
};

/**
 *
 * @description Refresh User Token
 * @returns Set Updated Token to Store
 */
export const RefreshToken = async () => {
  try {
    const token: any = await api.put(`/external/auth/token/refresh`, {
      token: userStore.token.get(),
      application: 'MOBILE',
    });
    userStore.token.set(token?.data?.token);
    api.setHeaders({
      Authorization: `Bearer ${token?.data?.token}`,
    });
    setDataInLocalStorage('token', JSON.stringify(token?.data?.token));
  } catch (error) {
    console.log('error RefreshToken', error);
  }
};