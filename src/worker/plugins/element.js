import Vue from 'vue'
import {
    Loading,
    MessageBox,
    Message,
    Notification,
    Col,
    Input
} from 'element-ui'

Vue.use(Col);
Vue.use(Input);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;