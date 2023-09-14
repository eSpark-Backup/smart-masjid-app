import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';
import moment from 'moment';

import { api } from '.';
import { masjidStore } from '../store/MasjidStore';
import {
  IqamahTime,
  JummahTime,
  Masjid,
  SalahTimings,
} from '../types/masjidControllerTypes';

/**
 *
 * @description Get masjid info
 * @returns get data of masjid and save to masjidStore
 */
export const GetMasjid = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}`);
    if (result.status == 200) {
      masjidStore.masjid.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Get Adhan Configuration
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const GetMasjidAdhanSetting = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/adhan/config`);
    if (result.status == 200) {
      masjidStore.adhanConfig.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Get Adhan Configuration
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const GetMasjidIqamahTiming = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/iqama`);
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 *
 * @description Get Adhan Configuration
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const AddMasjidIqamahTiming = async (
  masjidId: string,
  data: IqamahTime,
) => {
  try {
    const result: any = await api.post(`/masjid/${masjidId}/iqama`, data);
    if (result.status == 200) {
      masjidStore.iqamahTime.set(result.data);
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
 *
 * @description Get Adhan Configuration
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
 *
 * @description Get Adhan Configuration
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
 *
 * @description Get Iqama history
 * @returns get Iqama history of masjid and save to masjidStore
 */
export const GetIqamahHistory = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/iqama/history`);
    if (result.status == 200) {
      masjidStore.iqamahHistory.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Get Adhan Timings
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
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Get Jummah Configuration
 * @returns get data of masjid Jummah and save to masjidStore
 */
export const GetMasjidJummahTiming = async (
  masjidId: string,
  date?: string,
) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/jumuah`, {
      date: date,
    });

    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 *
 * @description Get Current Jummah Timings
 * @returns get data of masjid Jummah and save to masjidStore
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
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error', error);
  }
};

/**
 *
 * @description Add Jumuah Timing
 * @returns get data of masjid jumuah and save to masjidStore
 */
export const AddMasjidJummahTiming = async (
  masjidId: string,
  data: JummahTime,
) => {
  try {
    const result: any = await api.post(`/masjid/${masjidId}/jumuah`, data);
    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
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
 *
 * @description Update Jumuah Timing
 * @returns get data of masjid Jumuah and save to masjidStore
 */
export const UpdatedMasjidJummahTiming = async (
  masjidId: string,
  data: JummahTime,
) => {
  try {
    const result: any = await api.put(
      `/masjid/${masjidId}/jumuah/${data.id}`,
      data,
    );
    console.log(result);
    if (result.status == 200) {
      masjidStore.JummahTime.set(result.data);
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
 *
 * @description Delete Jummah Time
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
 *
 * @description Get Jummah history
 * @returns get Jummah history of masjid and save to masjidStore
 */
export const GetJummahHistory = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/jumuah/history`);
    if (result.status == 200) {
      masjidStore.JummahHistory.set(result.data);
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
};

/**
 *
 * @description Search Masjid by Zip Code and Location
 * @returns get masjid and and return masjid list
 */
export const SearchMasjidByLocation = async (
  zipcode: string | number = '',
  lat: string | number = 0,
  long: string | number = 0,
) => {
  try {
    const result = await api.get(
      `/masjid/search?latitude=${lat}&longitude=${long}&zip=${zipcode}&distance=100`,
    );
    console.log('result', result);

    if (result.status == 200 && result.data) {
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error SearchMasjidByLocation', error);
  }
};

/**
 *
 * @description Get list of masjid subscribed by user
 * @returns get masjid and and return masjid list
 */
export const getListMasjidSubscribedByUser = async (userId: string) => {
  try {
    const result = await api.get(`/masjid/subscriptions/user/${userId}`);
    const masjidList = result.data as Masjid[];
    // console.log("masjidList", masjidList);
    masjidStore?.userMasjidList?.set(
      masjidList?.length > 0 ? masjidList : null,
    );
    return result.data;
  } catch (error) {
    console.log('getListMasjidSubscribedByUser error: ', error);
  }
};

/**
 *
 * @description Get Salah Timing of masjid
 * @returns return Salah Timing of masjid
 */
export const getSalahTimingsOfMasjid = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/salah`);
    const timings = result?.data?.timings as SalahTimings[];
    console.log('masjidList', result?.data);
    masjidStore?.salahTimings?.set(timings ?? []);
    return timings;
  } catch (error) {
    console.log('getSalahTimingsOfMasjid error: ', error);
  }
};
