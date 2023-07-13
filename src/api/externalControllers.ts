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
      externalStore.countryCodes.set([...result.data]);
    }
  } catch (error) {}
};

/**
 *
 * @description Check's Device Based on Device MacAddress
 * @returns Promise<boolean>
 * @todo //todo: Delete This later
 */

export async function _checkDeviceExists(mac_address: string) {
  console.log('Device info in api???', mac_address);
  const uriEncodedString = encodeURIComponent(mac_address!);
  console.log('kiaaaaa', uriEncodedString);

  try {
    const res = await api.get(
      'external/device/exists?macAddress=' + uriEncodedString,
    );
    if (res?.ok) {
      console.log('Success', Boolean(res.data));
      if (res.data) return Boolean(res.data);
    } else {
      console.log('Problem status', res.status, res.data);
    }
  } catch (e) {
    console.log('when device exists problems', e);
  }
}
