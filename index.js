/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'core-js/es6/symbol'
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
