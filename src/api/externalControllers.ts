import { api } from '.';
import { externalStore } from '../store/ExternalStore';

/**
 *
 * @description Get Available Country Codes
 * @returns get Available Country Codes and save to deviceStore
 */
export const GetCountryCodes = async () => {
  try {
    const result: any = await api.get(`/external/country-codes`);
    if (result.status == 200) {
      externalStore.countryCodes.set([
        ...result.data,
        ...[
          {
            id: 555,
            country: 'Pakistan',
            code: '+92',
            enabled: true,
            iso_code: 'PK',
          },
        ],
      ]);
    }
  } catch (error) {}
};
