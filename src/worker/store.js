import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}
    },
    getters: {
        nickName: state => {
            return state.userInfo.staff_name;
        },
        company: state => {
            return state.userInfo.company_name || '系统后台';
        }
    },
    mutations: {
        setUserInfo: (state, payload) => {
            localStorage.setItem('userInfo', JSON.stringify(payload.userInfo));
            state.userInfo = payload.userInfo;
        }
    },
    actions: {
        setUserInfo: ({commit}, payload) => {
            commit({
                type: 'setUserInfo',
                userInfo: payload
            });
        }
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
