import { api, xApi } from '.';
import { externalStore } from '../store/ExternalStore';
import Toast from 'react-native-toast-message';
import { userStore } from '../store/UserStore';
import { setDataInLocalStorage } from '../utils';
import { globalStore } from '../store/GlobalStates';
import {
  CreateUserRequest,
  FailCheckPhoneId,
  SuccessCheckPhoneId,
  UserResponse,
} from '../types/userControllerApiResponse';

/**
 *
 * @description Get Available Country Codes
 * @returns get Available Country Codes and save to deviceStore
 */
export const GetCountryCodes = async () => {
  try {
    const result: any = await xApi.get(`/external/country-codes`);
    if (result.status == 200) {
      externalStore.countryCodes.set([...result.data]);
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
    const result: any = await xApi.post(`/external/auth/otp/send`, {
      email: email ?? '',
      phone: phone ?? '',
    });
    if (result.status === 200) {
      // Toast.show({
      //   text2: 'OTP sent successfully',
      //   type: 'success',
      // });
      return true;
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
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
    const result: any = await xApi.post(`/external/auth/otp/validate`, {
      email: email ?? '',
      phone: phone ?? '',
      otp: otp ?? '',
    });
    console.log('🚀 ~ file: userController.ts:322 ~ phone:', phone);
    console.log('🚀 ~ file: userController.ts:319 ~ result:', result);
    if (result.status === 200 && result.data) {
      // Toast.show({
      //   text2: 'OTP verification successfully',
      //   type: 'success',
      // });
      return true;
    } else {
      Toast.show({
        text2: result.data?.message ?? 'OTP verification failed',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
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
    const token: any = await xApi.put(`/external/auth/token/refresh`, {
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

/**
 *
 * @description Checking User exists with given Email/Phone
 * @returns get data of user and save to userStore
 */
export const LoginUser = async (email: string, phone: string, otp: string) => {
  try {
    const result: any = await xApi.get(
      `/external/users/exists?email=${email}&phone=${
        phone ? phone.replace('+', '%2B') : ''
      }`,
    );
    console.log('result LoginUser', result);
    if (result.data) {
      const login = await xApi.put(`/users/${result?.data?.id}/login`, {
        phoneDeviceId: globalStore.phoneId?.get(),
      });
      const token: any = await xApi.post(`/external/auth/token/create`, {
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
        visibilityTime: 10000,
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
    const result = await xApi.get(
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
 * @description Check if the user phone id is already registered in the Server
 * @returns Promise<PhoneIdResponse>
 * @todo //todo: Delete This later
 */

type PhoneIdResponse = SuccessCheckPhoneId | FailCheckPhoneId | undefined;

export async function _checkPhoneId(phoneId: string): Promise<PhoneIdResponse> {
  try {
    const res = await xApi.get<SuccessCheckPhoneId, FailCheckPhoneId>(
      '/external/phone/exists?deviceId=' + phoneId,
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
    const result: any = await xApi.post<UserResponse>(
      '/external/user/account',
      data,
    );
    if (result.status == 200 && result.data) {
      const token: any = await xApi.post(`/external/auth/token/create`, {
        application: 'MOBILE',
        userId: result.data.id,
        lastOTPVerified: otp,
      });
      userStore.token.set(token?.data?.token);
      userStore.currentRegisterUser.set(result.data);
      console.log('Kha tk chala');

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
 * @description Check's Device Based on Device MacAddress
 * @returns Promise<boolean>
 * @todo //todo: Delete This later
 */

export async function _checkDeviceExists(mac_address: string) {
  console.log('Device info in api???', mac_address);
  const uriEncodedString = encodeURIComponent(mac_address!);
  console.log('kiaaaaa', uriEncodedString);

  try {
    const res = await xApi.get(
      'external/device/exists?macAddress=' + uriEncodedString,
    );
    if (res?.ok) {
      console.log('Success', Boolean(res.data));
      if (res.data) return Boolean(res.data);
    } else {
      console.log('Problem status', res.status, res.data);
    }
  } catch (e) {
    console.log('when device exists problems', e);
  }
}
