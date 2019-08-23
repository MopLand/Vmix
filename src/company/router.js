import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        //分公司管理员
        {
            name: 'home',
            path: '/',
            component: () => import('./views/pages/Home'),
            meta: {title: '首页', icon: 'ios-home'}
        },
         {
            name: 'statis',
            path: '/statis',
            component: () => import('./views/pages/Statis'),
            meta: {title: '排行榜', icon: 'md-person'}
        },
        {
            name: 'pay',
            path: '/pay',
            component: () => import('./views/pages/Pay'),
            meta: {title: '购买套餐', icon: 'ios-cloud-upload-outline'}
        },
         {
            // name: 'agt',
            // path: '/agt',
            // component: () => import('./views/pages/Agt'),
            // meta: {title: '卡密', icon: 'ios-contact'},
            // children: [
            //         {
            //             name: 'agent',
            //             path: 'agent',
            //             component: () => import('./views/pages/agt/Agent'),
            //             meta: {title: '卡密验证'}
            //         },
            //          {
                    name: '/agentcard',
                    path: '/agentcard',
                    component: () => import('./views/pages/agt/Agentcard'),
                    meta: {title: '购买卡密', icon: 'ios-contact'}
                    // },
            // ]
        },
        {
            name: 'user',
            path: '/user',
            component: () => import('./views/pages/sys/User'),
            meta: {title: '员工账号', icon: 'md-person'}
        },
        {
            name: 'Workstation',
            path: '/workstation',
            component: () => import('./views/pages/Workstation'),
            meta: {title: '工位绑定', icon: 'md-repeat'}
        },
        {
            name: 'login',
            path: '/login',
            component: () => import('./views/Login'),
            meta: {title: '登录'},
            hidden: true
        },
        {
            name: 'reg',
            path: '/reg',
            component: () => import('./views/Reg'),
            meta: {title: '注册'},
            hidden: true
        },
        {
            name: 'forget',
            path: '/forget',
            component: () => import('./views/Forget'),
            meta: {title: '忘记密码'},
            hidden: true
        },
        {
            name: 'paysuccess',
            path: '/paysuccess',
            component: () => import('./views/pages/Paysuccess'),
            meta: {title: '支付成功', icon: 'md-repeat', role: 98},
            hidden: true
        },
        {
            name: 'stats',
            path: '/stats',
            component: () => import('./views/pages/Stats'),
            meta: {title: '工作统计', icon: 'ios-stats', role: 98},
            hidden: true
        },
        {
            name: 'settle',
            path: '/settle',
            component: () => import('./views/pages/Settle'),
            meta: {title: '佣金结算', icon: 'logo-usd'},
        },
        {
            name: 'titles',
            path: '/titles',
            component: () => import('./views/pages/Titles'),
            meta: {title: '活动标题', icon: 'ios-cog'}
        },
        {
            path: '/403',
            name: 'forbidden',
            component: () => import('./views/errors/403'),
            hidden: true
        },
        {
            path: '/404',
            name: 'notFound',
            component: () => import('./views/errors/404'),
            hidden: true
        },
        {
            path: '*',
            component: () => import('./views/errors/404'),
            hidden: true
        }
    ]
})
