import { api } from '.';
import {
  CreateUserRequest,
  FailCheckPhoneId,
  RequestRegisterPhone,
  SuccessCheckPhoneId,
  UserResponse,
} from '../types/userControllerApiResponse';
import { userStore } from '../store/UserStore';
import Toast from 'react-native-toast-message';

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
): Promise<UserResponse | undefined> => {
  try {
    const result: any = await api.post<UserResponse>('/users', data);
    if (result.data) userStore.set({ userData: result.data });
    return result.data;
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
export const LoginUser = async (email: string, phone: string) => {
  try {
    const result: any = await api.get(`/users?email=${email}&phone=${phone}`);
    if (result.data && result.data.length > 0) {
      userStore.set({ userData: result.data[0] });
      return result.data[0]
    }else {
      Toast.show({
        text2: 'User not found',
        type: 'error',
      })
    }
  } catch (error) {
    console.log('error LoginUser', error, 'Request', email);
  }
};
