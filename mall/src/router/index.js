import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import { asyncImport } from '@/utils'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/goods',
      component: asyncImport('Goods/index'),
      children: [
        {
          path: '/',
          redirect: 'list'
        },
        {
          path: 'list',
          component: asyncImport('Goods/list'),
        },
        {
          path: 'cart',
          component: asyncImport('Goods/cart'),
        },
        {
          path: 'add',
          component: asyncImport('Goods/add'),
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
