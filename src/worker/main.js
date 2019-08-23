import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/axios'
import './plugins/clipboard'
import './plugins/moment'
import './plugins/directives'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
