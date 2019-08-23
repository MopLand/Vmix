import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import {Loading, Message} from 'element-ui'
import router from '../router'

const instance = axios.create({
    baseURL: '/backend',
    timeout: 60 * 1000,
    paramsSerializer(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
    }
});

instance.interceptors.request.use(config => {
    if (config.loading !== false) {
        Loading.service({
            lock: true
        });
    }

    return config
}, err => {
    Message.error(err.message);
    return Promise.reject(err)
});

instance.interceptors.response.use(resp => {
    if (resp.config.loading !== false)
        Loading.service({}).close();

    let data = resp.data;
    if (data.status !== 0) {
        if (data.special === 'login') {
            router.push({name: 'login'})
        } else {
            Message.error(data.result);
        }
        return new Promise(() => {
        })
    }
    return resp.data
}, err => {
    if (err.config.loading !== false)
        Loading.service({}).close();
    Message.error(err.message);
    return Promise.reject(err)
});

Vue.prototype.$http = instance;