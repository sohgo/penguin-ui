import Vue from 'vue'
import VueRouter from 'vue-router'
import MainBeginning from '@/MainBeginning'
import Step1Input from '@/Step1Input'
import Step1End from '@/Step1End'
import MainError from '@/common/MainError'
import NotFound from '@/common/NotFound'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'MainBeginning',
        component: MainBeginning
    },
    {
        path: '/Step1Input',
        name: 'Step1Input',
        component: Step1Input
    },
    {
        path: '/Step1End',
        name: 'Step1End',
        component: Step1End
    },
    {
        path: '/Error',
        name: 'MainError',
        component: MainError
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
]

const router = new VueRouter({
    //mode: 'history',
    mode: 'hash',
    routes
})

export default router
