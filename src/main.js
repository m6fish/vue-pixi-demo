import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'

import '@/css/index.scss'

// register the plugin
gsap.registerPlugin(PixiPlugin)

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
