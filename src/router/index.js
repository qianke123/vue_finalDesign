import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Myfolder from '../components/myfolder.vue'
import ShareCenter from '../components/shareCenter.vue'
import Test from '../components/test.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/test', component: Test },
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/myfolder', component: Myfolder },
        { path: '/shareCenter', component: ShareCenter }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数, 表示放行
  // next() 放行 next('/login') 强制向login跳转
  var token = window.sessionStorage.getItem('fileCloudToken')
  if (to.path === '/login') {
    if (!token) {
      return next()
    } else {
      return next('/home')
    }
  } else if (!token) {
    return next('/login')
  } else {
    return next()
  }
})

export default router
