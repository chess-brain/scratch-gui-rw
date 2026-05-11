import SettingsStore from './settings-store';
import { AESettings } from '../lib/settings.js';

const settingStore = new SettingsStore();
const urlParameters = new URLSearchParams(location.search);

const aeSettings = new AESettings();
if (urlParameters.has('mobile')) {
    aeSettings.set('EnableMobileLayout', true);
}
if (urlParameters.has('touch')) {
    aeSettings.set('EnableMobileTouchDrag', true);
}
if (urlParameters.has('mobile-full')) {
    aeSettings.set('EnableMobileLayout', true);
    aeSettings.set('EnableMobileTouchDrag', true);
}

if (urlParameters.has('addons')) {
    settingStore.parseUrlParameter(urlParameters.get('addons'));
} else {
    settingStore.readLocalStorage();
}

export default settingStore;
