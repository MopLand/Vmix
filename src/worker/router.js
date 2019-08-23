import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'login',
            path: '/login',
            component: () => import('./views/Login'),
            hidden: true
        },
        {
            name: 'index',
            path: '/',
            component: () => import('./views/Index'),
            children: [
                {
                    name: 'home',
                    path: '',
                    component: () => import('./views/pages/Home'),
                    meta: {title: '首页', icon: 'fa fa-home'}
                },
                {
                    name: 'event',
                    path: 'event',
                    component: () => import('./views/pages/Event'),
                },
                {
                    name: 'eventGood',
                    path: 'event/:eventId/good',
                    component: () => import('./views/pages/event/Good')
                },
                {
                    name: 'eventEffect',
                    path: 'event/:eventId/effect',
                    component: () => import('./views/pages/event/Effect')
                },
                {
                    name: 'eventOrder',
                    path: 'event/:eventId/order',
                    component: () => import('./views/pages/event/Order')
                },
                {
                    name: 'order',
                    path: 'order',
                    component: () => import('./views/pages/Order')
                },
                {
                    name: 'effect',
                    path: 'effect',
                    component: () => import('./views/pages/Effect')
                },
                {
                    name: 'search',
                    path: 'search',
                    component: () => import('./views/pages/Case'),
                }]
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
