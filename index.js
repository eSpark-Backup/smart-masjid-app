/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import App from './src/navigation';
import { name as appName } from './app.json';
import { _requestUserPermission } from './src/utils/functions';

_requestUserPermission();
enableLatestRenderer();
AppRegistry.registerComponent(appName, () => App);
