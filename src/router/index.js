import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sample from '../views/sample2.vue'


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
        // component: () => import(/* webpackChunkName: "sample2" */ '../views/sample2.vue')
        component: Sample
    }
]

const router = new VueRouter({
    routes
})

export default router
