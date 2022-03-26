import { useRouter } from "@/composables/router";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const { setRoute } = useRouter();

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
      layout: "custom",
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: {
      layout: "custom",
      requiresAuth: true,
    },
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("@/views/Projects.vue"),
    meta: {
      layout: "custom",
      requiresAuth: true,
    },
  },
  {
    path: "/project/:id",
    name: "project",
    props: true,
    component: () => import("@/views/Project.vue"),
    meta: {
      layout: "custom",
      requiresAuth: true,
    },
  },
  {
    path: "/videos",
    name: "videos",
    component: () => import("@/views/Videos.vue"),
    meta: {
      layout: "custom",
    },
  },
  {
    path: "/activity",
    name: "activity",
    component: () => import("@/views/Activity.vue"),
    meta: {
      layout: "custom",
    },
  },
  {
    path: "/subscription",
    name: "subscription",
    component: () => import("@/views/Subscription.vue"),
    meta: {
      layout: "custom",
    },
  },
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/views/Inbox.vue"),
    meta: {
      layout: "custom",
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
  setRoute(to);
  const accessToken = localStorage.getItem("accessToken");

  // Redirect to login if not logged in
  if (!accessToken && to.meta.requiresAuth) return next({ name: "auth-login" });

  // Redirect if logged in
  //if (to.meta.redirectIfLoggedIn && accessToken) return next({ name: 'home' })

  return next();
});

export default router;
