import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      layout: "content",
      requiresAuth: true,
    },
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("@/views/Projects.vue"),
    meta: {
      layout: "content",
      requiresAuth: true,
    },
  },
  {
    path: "/projects/:id",
    name: "project",
    component: () => import("@/views/Project.vue"),
    meta: {
      layout: "content",
      requiresAuth: true,
    },
  },
  {
    path: "/videos",
    name: "videos",
    component: () => import("@/views/Videos.vue"),
    meta: {
      layout: "content",
    },
  },
  {
    path: "/login",
    name: "auth-login",
    component: () => import("@/views/Login.vue"),
    meta: {
      layout: "blank",
      redirectIfLoggedIn: true,
    },
  },
  {
    path: "/signup",
    name: "auth-signup",
    component: () => import("@/views/Signup.vue"),
    meta: {
      layout: "blank",
      redirectIfLoggedIn: true,
    },
  },
  {
    path: "*",
    redirect: "error-404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, _, next) => {
  const accessToken = localStorage.getItem("accessToken");

  // Redirect to login if not logged in
  if (!accessToken && to.meta.requiresAuth) return next({ name: "auth-login" });

  // Redirect if logged in
  //if (to.meta.redirectIfLoggedIn && accessToken) return next({ name: 'home' })

  return next();
});

export default router;
