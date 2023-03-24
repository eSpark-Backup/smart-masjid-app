import { api } from '.';
import {
  FailCheckPhoneId,
  SuccessCheckPhoneId,
} from '../types/userControllerApiResponse';
import { userStore } from '../store/UserStore';

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

export const CreateUser = async (data: any) => {
  try {
    const result: any = await api.post('/users', data);
    console.log('result', result);
    userStore.userData.set(result);
    return true;
  } catch (error) {
    console.log('error', error);
  }
};
