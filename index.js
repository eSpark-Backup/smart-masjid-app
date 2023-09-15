/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import App from './src/navigation';
import { name as appName } from './app.json';
import { _requestUserNotificationPermission } from './src/utils/functions';

LogBox.ignoreLogs(['VirtualizedList', 'new NativeEventEmitter()']);

_requestUserNotificationPermission();
enableLatestRenderer();
AppRegistry.registerComponent(appName, () => App);
