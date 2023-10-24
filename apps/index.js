/**
 * @format
 */

import {AppRegistry,Platform } from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import KeyboardManager from 'react-native-keyboard-manager';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(false);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setLayoutIfNeededOnUpdate(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText("키판 내리기"); 
}
