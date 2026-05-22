import { setBuiltInComponents } from './built-in-components';
import label from './label/label.component';
import alert from './alert/alert.component';
import tabs from './tabs/tabs.component';

export function loadBuiltInComponents() {
    setBuiltInComponents([label, alert, tabs]);
}
