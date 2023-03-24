import { getUniqueId } from 'react-native-device-info';

/**
 *
 * @description Used to get the phone's unique id
 * @returns Promise<string>
 * @todo //todo: Delete This later
 */

async function _getPhoneId(): Promise<string> {
  const res = await getUniqueId();
  return res;
}

export { _getPhoneId };
