/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox, Text, TextInput } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import App from './src/navigation';
import { name as appName } from './app.json';
import { _requestUserNotificationPermission } from './src/utils/functions';

LogBox.ignoreLogs(['VirtualizedList', 'new NativeEventEmitter()']);

// Override Text scaling
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

// Override Text scaling in input fields
if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

_requestUserNotificationPermission();
enableLatestRenderer();
AppRegistry.registerComponent(appName, () => App);
