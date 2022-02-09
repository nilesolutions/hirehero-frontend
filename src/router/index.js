import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/Projects.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/projects/:id',
    name: 'project',
    component: () => import('@/views/Project.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('@/views/Videos.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

export default router
