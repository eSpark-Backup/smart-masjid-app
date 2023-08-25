import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '.';
import { SalahTimings } from '../types/masjidControllerTypes';

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
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('error SearchMasjidByLocation', error);
  }
};

/**
 * @description Get adhan timings of specific masjid
 * @param {masjidId} masjidId- Masjid id to get adhan
 * @returns - list of adhan timings from API response
 */
export const GetMasidAdhanTimings = async (masjidId: string) => {
  try {
    const result = await api.get(`masjid/${masjidId}/adhan`);
    if (result.status == 200 && result.data) {
      return result.data;
    }
  } catch (error: any) {
    // crashlytics().recordError(error);
    console.log('error GetMasidAdhanTimings', error);
  }
};

/**
 * @description Get iqamah timings of specific masjid
 * @param {masjidId} masjidId - Masjid id to get iqamah
 * @returns - list of iqamah timings from API response
 */
export const GetMasidIqamaTimings = async (masjidId: string) => {
  try {
    const result = await api.get(`masjid/${masjidId}/iqama`);
    if (result.status == 200 && result.data) {
      return result.data;
    }
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('error GetMasidIqamaTimings', error);
  }
};

/**
 * @description Get Salah Timings of specific masjid
 * @param {masjidId} masjidId - Masjid Id to retrieve timings
 * @returns {SalahTimings} SalahTimings - list of Salah timings from API response
 */
// export const getSalahTimings = (masjidId: string): SalahTimings => {

// }
