import crashlytics from '@react-native-firebase/crashlytics';

import { api } from '.';

/**
 * Search for masjids by zip code and location coordinates.
 *
 * @param [zipcode=''] - The zip code to use for the search. Optional.
 * @param [lat=0] - The latitude coordinate for the search location. Optional.
 * @param [long=0] - The longitude coordinate for the search location. Optional.
 * @returns - An array of masjids found in the specified area or undefined if there is an error.
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
 * @description Get adhan timings of specific masjid
 * @param masjidId - Masjid id to get adhan
 * @returns - list of adhan timings from API response
 */
export const GetMasidAdhanTimings = async (masjidId: string) => {
  try {
    const result = await api.get(`masjid/${masjidId}/adhan`);
    if (result.status == 200 && result.data) {
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error GetMasidAdhanTimings', error);
  }
};

/**
 * @description Get iqamah timings of specific masjid
 * @param masjidId - Masjid id to get iqamah
 * @returns - list of iqamah timings from API response
 */
export const GetMasidIqamaTimings = async (masjidId: string) => {
  try {
    const result = await api.get(`masjid/${masjidId}/iqama`);
    if (result.status == 200 && result.data) {
      return result.data;
    }
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log('error GetMasidIqamaTimings', error);
  }
};
