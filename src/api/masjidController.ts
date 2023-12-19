import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import { api } from '.';
import { masjidStore } from '../store/MasjidStore';
import {
  AddJummas,
  IqamahTime,
  Masjid,
  SalahTimings,
} from '../types/masjidControllerTypes';
import { LogoutUser } from './userController';
import { userStore } from '../store/UserStore';

/**
 *
 * @param masjidId - The ID of the masjid to retrieve information for.
 * @returns get data of masjid and save to masjidStore
 */
export const GetMasjid = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}`);
    if (result.status == 200) {
      masjidStore.masjid.set(result.data);
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
  }
};

/**
 * Get the Adhan configuration for a masjid.
 *
 * @param masjidId - The ID of the masjid for which to retrieve the Adhan configuration.
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const GetMasjidAdhanSetting = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/adhan/config`);
    if (result.status == 200) {
      // masjidStore.adhanConfig.set(result.data);
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
  }
};

/**
 * Get the Iqamah timing for a masjid.
 *
 * @param masjidId - The ID of the masjid for which to retrieve the Iqamah timing.
 * @returns A `Promise` that resolves to Iqamah timing data if successful, or handles errors if there was a problem.
 */
export const GetMasjidIqamahTiming = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/iqama`);
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
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
    console.log('error', error);
  }
};

/**
 * Add Iqamah timing for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid to add Iqamah timing for.
 * @param data - The data representing Iqamah timing to add.
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const AddMasjidIqamahTiming = async (
  masjidId: string,
  data: IqamahTime,
) => {
  try {
    console.log('start result');
    const result: any = await api.post(`/masjid/${masjidId}/iqama`, data);
    console.log('result.data', result);
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Update Iqamah timing for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to update Iqamah timing.
 * @param data - The updated data representing Iqamah timing.
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const UpdateMasjidIqamahTiming = async (
  masjidId: string,
  data: IqamahTime,
) => {
  try {
    const result: any = await api.put(
      `/masjid/${masjidId}/iqama/${data.id}`,
      data,
    );
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      console.log('result.data', result.data?.message);
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Delete Iqamah timing for a masjid and update masjidStore.
 *
 * @param masjidId - The ID of the masjid from which to delete Iqamah timing.
 * @param iqamaId - The ID of the Iqamah timing to delete.
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const DeleteMasjidIqamahTiming = async (
  masjidId: string,
  iqamaId: string,
) => {
  try {
    const result: any = await api.delete(
      `/masjid/${masjidId}/iqama/${iqamaId}`,
    );
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Get the Iqama history for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to retrieve the Iqama history.
 * @returns get Iqama history of masjid and save to masjidStore
 */
export const GetIqamahHistory = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/iqama/history`);
    if (result.status == 200) {
      masjidStore.iqamahHistory.set(result.data);
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
  }
};

/**
 * Get the Adhan timings for a masjid by date and save them to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to retrieve Adhan timings.
 * @param date - The date for which to retrieve Adhan timings (optional).
 * @param range - The range for retrieving Adhan timings (optional).
 * @returns get adhan timings of masjid by date and save to masjidStore
 */
export const GetAdhanTimings = async (
  masjidId: string,
  date?: string,
  range?: string,
) => {
  try {
    console.log('date', date);

    const result: any = await api.get(`/masjid/${masjidId}/adhan`, {
      date: '2023-09-01',
      range: 'MONTH',
    });
    if (result.status == 200) {
      masjidStore.adhanTimings.set(result.data);
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
  }
};

/**
 * Get the Jummah configuration for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to retrieve the Jummah configuration.
 * @param date - The date for which to retrieve the Jummah configuration (optional).
 * @returns A `Promise` that resolves to Jummah configuration data if successful, or handles errors if there was a problem.
 */
export const GetMasjidJummahTiming = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/jumuah`);

    if (result.status == 200) {
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
    console.log('error', error);
  }
};

/**
 * Get the Jummah configuration for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to retrieve the Jummah configuration.
 * @param date - The date for which to retrieve the Jummah configuration (optional).
 * @returns A `Promise` that resolves to Jummah configuration data if successful, or handles errors if there was a problem.
 */
export const GetMasjidCurrentJummahTiming = async (
  masjidId: string,
  date?: string,
) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/jumuah/current`, {
      date: date,
    });

    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
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
    console.log('error', error);
  }
};

/**
 * Add Jumuah timing for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to add Jumuah timing.
 * @param data - The data representing the Jumuah timing to add.
 * @returns get data of masjid jumuah and save to masjidStore
 */
export const AddMasjidJummahTiming = async (
  masjidId: string,
  data: AddJummas,
) => {
  try {
    const result: any = await api.post(`/masjid/${masjidId}/jumuah`, data);
    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Update Jumuah timing for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to update Jumuah timing.
 * @param data - The updated data representing the Jumuah timing.
 * @returns get data of masjid Jumuah and save to masjidStore
 */
export const UpdatedMasjidJummahTiming = async (
  masjidId: string,
  data: AddJummas,
) => {
  try {
    const result: any = await api.put(
      `/masjid/${masjidId}/jumuah/${data.id}`,
      data,
    );
    console.log(result);
    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Delete Jumuah timing for a masjid and save the updated data to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to delete Jumuah timing.
 * @param jumuahId - The ID of the Jumuah timing to delete.
 * @returns get data of masjid Jummah and save to masjidStore
 */
export const DeleteMasjidJummahTiming = async (
  masjidId: string,
  jumuahId: string,
) => {
  try {
    const result: any = await api.delete(
      `/masjid/${masjidId}/jumuah/${jumuahId}`,
    );
    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result.data?.message ?? 'Something went wrong',
        type: 'error',
        autoHide: true,
        visibilityTime: 10000,
      });
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 * Get Jummah history for a masjid and save it to masjidStore.
 *
 * @param masjidId - The ID of the masjid for which to get Jummah history.
 * @returns get Jummah history of masjid and save to masjidStore
 */
export const GetJummahHistory = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/jumuah/history`);
    if (result.status == 200) {
      masjidStore.JummahHistory.set(result.data);
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
  }
};

/**
 * Search for masjids by Zip Code and Location.
 *
 * @param [zipcode=''] - The Zip Code to use in the search.
 * @param [lat=0] - The latitude coordinate for the location.
 * @param [long=0] - The longitude coordinate for the location.
 * @returns An array of masjids that match the search criteria.
 */
export const SearchMasjidByLocation = async (
  zipcode: string | number = '',
  lat: string | number = 0,
  long: string | number = 0,
) => {
  console.log('lat long', lat, long);

  try {
    const result: any = await api.get(
      `/masjid/search?latitude=${lat}&longitude=${long}&zip=${zipcode}&distance=100`,
    );
    console.log('result', result);

    if (result.status == 200 && result.data) {
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
 * Get a list of masjids subscribed by a user.
 *
 * @param userId - The ID of the user.
 * @returns An array of masjids subscribed by the user or null if no subscriptions exist.
 */
export const getListMasjidSubscribedByUser = async (userId: string) => {
  try {
    console.log('GetMasjidlist chala', userId);
    const result: any = await api.get(`/masjid/subscriptions/user/${userId}`);
    console.log('user masjidlist result', result);
    if (result.status == 200 && result.data) {
      const masjidList = result.data as Masjid[];
      // console.log("masjidList", masjidList);
      masjidStore?.userMasjidList?.set(
        masjidList?.length > 0 ? masjidList : null,
      );
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
    console.log('getListMasjidSubscribedByUser error: ', error);
    crashlytics().recordError(error as Error);
  }
};

/**
 * Get Salah timings of a masjid for a specific date or month.
 *
 * @param masjidId - The ID of the masjid.
 * @param [date] - The date for which Salah timings are requested. Optional.
 * @returns An array of Salah timings for the masjid or undefined if there is an error.
 */
export const getSalahTimingsOfMasjid = async (
  masjidId: string,
  date?: string,
  range?: 'MONTH' | 'WEEK',
) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/salah`, {
      date: date?.toString(),
      range: range ? range : '',
    });
    if (result.status == 200 && result.data) {
      const timings = result?.data?.timings as SalahTimings[];
      return timings;
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
    }
  } catch (error) {
    console.log('getSalahTimingsOfMasjid error: ', error);
    crashlytics().recordError(error as Error);
  }
};

/**
 * Generate Monthly Schedule PDF of a masjid for a specific month.
 *
 * @param masjidId - The ID of the masjid.
 * @param [date] - The date for which Monthly Schedule is requested.
 * @param sendEmail - Flag for sending email.
 * @returns An array of Salah timings for the masjid or undefined if there is an error.
 */
export const generatePDf = async (
  masjidId: string,
  date: string,
  sendEmail: boolean,
) => {
  try {
    console.log('masjidId, date, sendEmail', masjidId, date, sendEmail);

    const result: any = await api.post(
      `/masjid/${masjidId}/monthly/pdf?date=${date.toString()}&sendEmail=${sendEmail}`,
      {
        emails: ['wirad@esparkconsultants.com'],
      },
    );
    console.log('result', result);
    console.log('result.data', result.data);

    if (result.status == 200 && result.data) {
      const filePath = result?.data;
      return filePath;
    } else if (result.status == 401) {
      await LogoutUser(userStore.userData.get()?.id.toString() ?? '');
    } else {
      Toast.show({
        text2: result?.data?.message ?? 'Something went wrong',
        type: 'error',
      });
    }
  } catch (error) {
    console.log('generatePDf error: ', error);
    crashlytics().recordError(error as Error);
  }
};
