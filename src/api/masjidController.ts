import { api } from '.';
import { masjidStore } from '../store/MasjidStore';

/**
 *
 * @description Get Adhan Configuration
 * @returns get data of masjid adhan config and save to masjidStore
 */
export const GetMasjidAdhanSetting = async (masjidId: string) => {
  try {
    const result: any = await api.get(`/masjid/${masjidId}/adhan/config`);
    if (result.status == 200) {
        masjidStore.adhanConfig.set(result.data)
    }
  } catch (error) {

  }
};
