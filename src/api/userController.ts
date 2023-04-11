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
): Promise<UserResponse | undefined> => {
  try {
    const result: any = await api.post<UserResponse>('/users', data);
    if (result.data) userStore.userData.set(result.data);
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
    const result: any = await api.get(
      `/external/users/exists?email=${email}&phone=${
        phone ? '%2B1' + phone : ''
      }`,
    );
    if (result.data) {
      await api.put(`/users/${result?.data?.id}/login`, {
        phoneDeviceId: globalStore.phoneId?.get(),
      });
      userStore.userData.set(result.data);
      setDataInLocalStorage('user', JSON.stringify(result.data));
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
        phone ? '%2B1' + phone : ''
      }`,
    );
   
    if(result.status == 200 && result.data) {
      return result.data;
    }else {
      return null
    }
  } catch (err) {}
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

    if (result.data) {
      userStore.userData.set(result.data);
      await setDataInLocalStorage('user', JSON.stringify(result.data));
      Toast.show({
        text2: 'User Updated Successfully',
        type: 'success',
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
 export const AddAdminIntoMasjid = async (
  userId: string,
  masjidId: string,
) => {
  try {
    const result: any = await api.post(`/users/${userId}/masjid/${masjidId}`);
    if (result.status === 200) {
      Toast.show({
        text2: 'Admin added to the masjid',
        type: 'success',
      });
      GetMasjidAdmins(masjidId);
      return true
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