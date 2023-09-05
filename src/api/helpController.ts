import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '.';
import { SalahTimings } from '../types/masjidControllerTypes';
import { helpStore } from '../store/HelpStore';

/**
 *
 * @description Get help FAQs
 * @returns list of FAQs
 */
export const GetHelpFAQs = async () => {
  try {
    const result = await api.get(`/help`);
    if (result.status == 200 && result.data) {
      console.log('FAQ result', result.data);
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error SearchMasjidByLocation', error);
  }
};

/**
 * @description Get ContactUs Reasons
 * @returns - list of Reasons
 */
export const GetContactReasons = async () => {
  try {
    const result: any = await api.get(`/help/contact/reasons`);
    if (result.status == 200 && result.data) {
      console.log('Reason result', result.data);
      helpStore.reasons.set(result?.data);
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error GetContactReasons', error);
  }
};

/**
 * @description Create Contact Us request to support team
 * @param {requestData} requestData - Data for Contact Us request
 * @returns - list of iqamah timings from API response
 */
export const CreateSupportRequest = async (requestData: string) => {
  try {
    const result = await api.post(`help/contact`, requestData);
    if (result.status == 200 && result.data) {
      console.log('Support Request Created Successfully');
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error GetMasidIqamaTimings', error);
  }
};
