import Vue from 'vue'
import {Button, Message, Notice, LoadingBar, ButtonGroup, Modal, Switch, Tree, Icon, Alert, Input} from 'iview'

Vue.component('i-switch', Switch)
Vue.component('Button', Button)
Vue.component('ButtonGroup', ButtonGroup)

import 'iview/dist/styles/iview.css'

Vue.component('Modal', Modal);
Vue.component('Tree', Tree);
Vue.component('Icon', Icon);
Vue.component('Alert', Alert);
Vue.component('Input', Input);
Vue.prototype.$message = Message;
Vue.prototype.$notice = Notice;
Vue.prototype.$loading = LoadingBar;
Vue.prototype.$modal = Modal;