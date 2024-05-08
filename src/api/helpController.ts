import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import { api } from '.';
import { helpStore } from '../store/HelpStore';
import { supportRequestData } from '../types';
import { LogoutUser } from './userController';
import { userStore } from '../store/UserStore';

/**
 * Fetches frequently asked questions (FAQs) from the help endpoint.
 *
 * @returns A `Promise` that resolves to an array of FAQs if successful, or rejects with an error if there was a problem.
 */

export const GetHelpFAQs = async () => {
  try {
    const result: any = await api.get(`/help`);
    if (result.status == 200 && result.data) {
      helpStore.FAQs.set(result?.data);
      return result.data;
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
    console.log('error SearchMasjidByLocation', error);
  }
};

/**
 * Fetches contact reasons from the help endpoint.
 *
 * @returns A `Promise` that resolves to an array of contact reasons if successful, or rejects with an error if there was a problem.
 */

export const GetContactReasons = async () => {
  try {
    const result: any = await api.get(`/help/contact/reasons`);
    if (result.status == 200 && result.data) {
      console.log('Reason result', result.data);
      helpStore.reasons.set(result?.data);
      return result.data;
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
    console.log('error GetContactReasons', error);
  }
};

/**
 * Creates a support request using the provided data.
 *
 * @param requestData - The data for the support request.
 */

export const CreateSupportRequest = async (requestData: supportRequestData) => {
  try {
    const result: any = await api.post(`help/contact`, requestData);
    if (result.status == 200 && result.data) {
      Toast.show({
        text2: result.data?.message ?? 'Request Submitted Successfully',
      });
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
    console.log('error GetMasidIqamaTimings', error);
  }
};
