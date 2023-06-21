/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import App from './src/navigation';
import { name as appName } from './app.json';
import { _requestUserNotificationPermission } from './src/utils/functions';

_requestUserNotificationPermission();
enableLatestRenderer();
AppRegistry.registerComponent(appName, () => App);
