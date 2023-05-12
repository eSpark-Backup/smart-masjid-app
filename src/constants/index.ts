import { Dimensions } from 'react-native';
import { USFlag } from '../assets';
const { width, height } = Dimensions.get('window');

export const CountryFlags = {
  'US': USFlag,
};

export { width as WINDOW_WIDTH, height as WINDOW_HEIGHT };
