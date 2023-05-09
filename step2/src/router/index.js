import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Entry from '@/Auth'
import Auth from '@/Auth'
import AuthError from '@/AuthError'
import Step2Input0 from '@/Step2Input0'
import Step2Input1 from '@/Step2Input1'
import Step2Input2 from '@/Step2Input2'
import Step2Input3 from '@/Step2Input3'
import Step2Input4 from '@/Step2Input4'
import Step2Input5 from '@/Step2Input5'
import Step2Input6 from '@/Step2Input6'
import Step2Input7 from '@/Step2Input7'
import Step2Input8 from '@/Step2Input8'
import InputDaily from '@/InputDaily'
import Step2Break from '@/Step2Break'
import End from '@/End'
import Error from '@/common/Error'
import NotFound from '@/common/NotFound'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Entry',
        component: Entry,
        meta: { authRequired: false },
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth,
        meta: { authRequired: false }
    },
    {
        path: '/autherror',
        name: 'autherror',
        component: AuthError,
        meta: { authRequired: false },
    },
    {
        path: '/input1',
        name: 'input1',
        component: Step2Input0,
        meta: { authRequired: true },
    },
    {
        path: '/input2',
        name: 'input2',
        component: Step2Input1,
        meta: { authRequired: true },
    },
    {
        path: '/input3',
        name: 'input3',
        component: Step2Input2,
        meta: { authRequired: true },
    },
    {
        path: '/input4',
        name: 'input4',
        component: Step2Input8,
        meta: { authRequired: true },
    },
    {
        path: '/input5',
        name: 'input5',
        component: Step2Input5,
        meta: { authRequired: true },
    },
    {
        path: '/input6',
        name: 'input6',
        component: Step2Input7,
        meta: { authRequired: true },
    },
    {
        path: '/input7',
        name: 'input7',
        component: Step2Input3,
        meta: { authRequired: true },
    },
    {
        path: '/daily',
        name: 'daily',
        component: Step2Input4,
        meta: { authRequired: true },
    },
    {
        path: '/day',
        name: 'day',
        component: InputDaily,
        meta: { authRequired: true },
    },
    {
        path: '/break',
        name: 'break',
        component: Step2Break,
        meta: { authRequired: true },
    },
    {
        path: '/end',
        name: 'end',
        component: End,
        meta: { authRequired: true },
    },
    {
        path: '/input0',
        name: 'input0',
        component: Step2Input6,
        meta: { authRequired: true },
    },
    {
        path: '/error',
        name: 'error',
        component: Error,
        meta: { authRequired: false },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: NotFound,
        meta: { authRequired: false },
    },
]

const router = new VueRouter({
    //mode: 'history',
    mode: 'hash',
    routes
})

router.beforeEach((to, from, next) => {
    //console.log('route:', to, from, next)
    if (to.matched.some(r => r.meta.authRequired)) {
        if (store.getters.isAuthed) {
            next()
            return
        } else {
            next('/Auth')
        }
    } else {
        next()
    }
})

export default router
