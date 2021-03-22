import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sample2',
        name: 'sample2',
        component: () => import(/* webpackChunkName: "sample2" */ '../views/sample2.vue')
    },
    {
        path: '/kaleidoscope',
        name: 'kaleidoscope',
        component: () => import(/* webpackChunkName: "kaleidoscope" */ '../views/kaleidoscope.vue')
    },
    {
        path: '/SHM',
        name: 'SHM',
        component: () => import(/* webpackChunkName: "SHM" */ '../views/SHM.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
