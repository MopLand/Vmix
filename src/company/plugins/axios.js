import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
// import store from '../store'
import router from '../router'
import {LoadingBar, Notice} from 'iview'
import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp)

const instance = axios.create({
    baseURL: '/',
    timeout: 60 * 1000,
    paramsSerializer(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
    }
});

instance.interceptors.request.use(config => {
    LoadingBar.start();
    return config
}, err => {
    Notice.error({
        title: '错误',
        desc: err.message
    });
    return Promise.reject(err)
});

instance.interceptors.response.use(res => {
    LoadingBar.finish();
    let data = res.data;
    if (data.status !== 0) {
        if (data.special === 'login') {
            router.push({name: 'login'})
        } else {
            Notice.error({
                title: '错误',
                desc: data.result
            });
        }
        return new Promise(() => {
        })
    }
    return res
}, err => {
    LoadingBar.finish();
    Notice.error({
        title: '错误',
        desc: err.message
    });
    return Promise.reject(err)
});

Vue.prototype.$http = instance;
// axios.defaults.baseURL = '/';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// Vue.prototype.$http = axios;