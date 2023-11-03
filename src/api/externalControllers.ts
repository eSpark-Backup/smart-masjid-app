import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import { api, xApi } from '.';
import { externalStore } from '../store/ExternalStore';
import { userStore } from '../store/UserStore';
import { setDataInLocalStorage } from '../utils';
import {
  CreateUserRequest,
  FailCheckPhoneId,
  SuccessCheckPhoneId,
  UserResponse,
} from '../types/userControllerApiResponse';
import { PhoneIdResponse } from '../types';

/**
 *
 * Fetches country codes from an external source.
 * @returns get Available Country Codes and save to deviceStore
 */
export const GetCountryCodes = async () => {
  try {
    const result: any = await xApi.get(`/external/country-codes`);
    if (result.status == 200) {
      externalStore.countryCodes.set([...result.data]);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 * Sends an OTP (One-Time Password) to the specified email or phone number.
 *
 * @param [email] - Optional. The email address to which the OTP will be sent.
 * @param [phone] - Optional. The phone number to which the OTP will be sent.
 * @returns A `Promise` that resolves to `true` if the OTP was successfully sent, or `false` if there was an error.
 */
export const SendOTP = async (email?: string, phone?: string) => {
  try {
    const result: any = await xApi.post(`/external/auth/otp/send`, {
      email: email ?? '',
      phone: phone ?? '',
    });
    if (result.status === 200) {
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
    crashlytics().recordError(error as Error);
    console.log('error SendOTP', error);
  }
};

/**
 * Validates an OTP (One-Time Password) sent to the specified email or phone number.
 *
 * @param otp - The OTP to validate.
 * @param [email] - Optional. The email address to which the OTP was sent.
 * @param [phone] - Optional. The phone number to which the OTP was sent.
 * @returns A `Promise` that resolves to `true` if the OTP was successfully validated, or `false` if there was an error.
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
    if (result.status === 200 && result.data) {
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
    crashlytics().recordError(error as Error);
    console.log('error ValidateOTP', error);
  }
};

/**
 *
 * Refreshes the authentication token.
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
    crashlytics().recordError(error as Error);
    console.log('error RefreshToken', error);
  }
};

/**
 * Logs in a user with the provided email, phone number, and OTP (One-Time Password).
 *
 * @param email - The user's email address.
 * @param phone - The user's phone number.
 * @param otp - The OTP (One-Time Password) for authentication.
 * @returns A `Promise` that resolves to user data if login is successful, or handles errors if there was a problem.
 */
export const LoginUser = async (email: string, phone: string, otp: string) => {
  try {
    const result: any = await xApi.get(
      `/external/users/exists?email=${email}&phone=${
        phone ? phone.replace('+', '%2B') : ''
      }`,
    );
    console.log('result LoginUser', result.data);
    if (result.data) {
      const token: any = await xApi.post(`/external/auth/token/create`, {
        application: 'MOBILE',
        userId: result.data.id,
        lastOTPVerified: otp,
      });
      if (token?.data?.token == null || token?.data?.token == '') {
        Toast.show({
          text2:
            'Some error occurred during account setup, please try logging in again',
          type: 'error',
        });
      } else {
        userStore.token.set(token?.data?.token);
        api.setHeaders({
          Authorization: `Bearer ${token?.data?.token}`,
        });
        userStore.userData.set(result.data);
        crashlytics().setAttributes({
          id: result.data?.id.toString(),
          email: result.data?.email,
          phone: result.data?.phone,
        });
        setDataInLocalStorage('user', JSON.stringify(result.data));
        setDataInLocalStorage('token', JSON.stringify(token?.data?.token));
        console.log('token', JSON.stringify(token?.data?.token));
        return result.data;
      }
    } else {
      Toast.show({
        text2: 'User not found',
        type: 'error',
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error LoginUser', error, 'Request', email);
  }
};

/**
 * Checks if a user with the provided email and phone number exists.
 *
 * @param email - The user's email address.
 * @param phone - The user's phone number.
 * @returns A `Promise` that resolves to user data if the user exists, or `null` if the user does not exist or there was an error.
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
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('err CheckUserExists', error);
  }
};

/**
 * Checks if a phone ID exists.
 *
 * @param phoneId - The phone ID to check.
 * @returns A `Promise` that resolves to a `PhoneIdResponse` if the phone ID exists, or rejects with an error if there was an issue.
 */
export async function _checkPhoneId(
  phoneId: string,
): Promise<boolean | undefined> {
  try {
    const res = await xApi.get<boolean>(
      '/external/phone/exists?deviceId=' + phoneId,
    );
    return res.data;
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log(error);
  }
}

/**
 * Creates a user account with the provided data and OTP (One-Time Password).
 *
 * @param data - The data for creating the user account.
 * @param otp - The OTP (One-Time Password) for authentication.
 * @returns A `Promise` that resolves to a `UserResponse` if the user account is created successfully, or `undefined` if there was an error.
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
      console.log('Kha tk chala', token);
      if (token?.data?.token == null || token?.data?.token == '') {
        Toast.show({
          text2: 'Some error occurred during account setup, please try again',
          type: 'error',
        });
      } else {
        userStore.token.set(token?.data?.token);
        userStore.currentRegisterUser.set(result.data);

        api.setHeaders({
          Authorization: `Bearer ${token?.data?.token}`,
        });
        await setDataInLocalStorage(
          'token',
          JSON.stringify(token?.data?.token),
        );
        return result.data;
      }
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error CreateUser', error, 'Request', data);
  }
};

/**
 * Checks if a device with the provided MAC address exists.
 *
 * @param mac_address - The MAC address of the device to check.
 * @returns A `Promise` that resolves to `true` if the device exists, `false` if it does not, or `undefined` if there was an error.
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
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('when device exists problems', error);
  }
}
