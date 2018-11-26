import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Goods from '@/view/Goods/index'
import GoodsList from '@/view/Goods/list'
import GoodsCart from '@/view/Goods/cart'

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
      component: Goods,
      children: [
        {
          path: '/',
          redirect: 'list'
        },
        {
          path: 'list',
          component: GoodsList,
        },
        {
          path: 'cart',
          component: GoodsCart,
        }
      ]
    }
  ]
})
