// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // 资产负债账户
      {
        path: '/balance',
        name: 'balance',
        component: PageView,
        redirect: '/balance/account',
        hideChildrenInMenu: true,
        meta: { title: '资产负债账户', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/balance/account',
            name: 'BalanceAccount',
            component: () => import('@/views/balance/account'),
            meta: { title: '资产负债账户', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      {
        path: '/transaction',
        name: 'transaction',
        component: PageView,
        redirect: '/transaction/list',
        hideChildrenInMenu: true,
        meta: { title: '事务记账', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/transaction/list',
            name: 'TransactionList',
            component: () => import('@/views/transaction/list'),
            meta: { title: '历史', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      {
        path: '/payment',
        name: 'payment',
        redirect: '/payment/history',
        component: PageView,
        meta: { title: '账单', icon: 'form', keepAlive: true, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/payment/history',
            name: 'ahaha',
            component: () => import('@/views/payment/Table'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          }]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
