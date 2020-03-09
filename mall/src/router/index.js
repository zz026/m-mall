import Vue from 'vue'
import Router from 'vue-router'
import { asyncImport } from '@/utils'

Vue.use(Router)

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: asyncImport('home')
    },
    {
      path: '/register',
      component: asyncImport('auth/register')
    },
    {
      path: '/goods',
      component: asyncImport('goods/index'),
      children: [
        {
          path: '/',
          redirect: 'list'
        },
        {
          path: 'list',
          component: asyncImport('goods/list'),
        },
        {
          path: 'cart',
          component: asyncImport('goods/cart'),
        },
        {
          path: 'add',
          component: asyncImport('goods/add'),
        }
      ]
    },
    {
      path: '/order',
      component: asyncImport('order/index'),
      children: [
        {
          path: '/',
          redirect: 'list'
        },
        {
          path: 'list',
          component: asyncImport('order/list'),
        },
        {
          path: 'detail/:id',
          component: asyncImport('order/detail'),
        },
      ]
    }
  ]
})
