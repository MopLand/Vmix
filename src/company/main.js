import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview'
import './plugins/axios'
import './plugins/moment'
// import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// })