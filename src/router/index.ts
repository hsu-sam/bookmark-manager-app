import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { userRoutes } from "./private.ts";
import { publicRoutes } from "./public.ts";

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  {
    path: "/logout",
    name: "auth.logout",
    component: () => import("../views/auth/Logout.vue"),
  },

  {
    path: "/u",
    alias: "/users",
    children: [...userRoutes],
    meta: { layout: "user" },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// / Middlewares

// router.beforeResolve((to, _from, next) => {
//   If this isn't an initial page load.
//   if (to.name) {
//     // Start the route progress bar.
//     NProgress.start()
//   }
//   next()
// })
// router.afterEach(() => {
//   Complete the animation of the route progress bar.
//   NProgress.done()
// })

// router.beforeEach(to => {
//    refreshNavigationController()

//   const authStore = useAuthStore()
//   if (to.meta.authless) {
//     return true
//   } else if (!authStore.isAuthenticated) {
//     return { name: 'auth.login' }
//   }
// })
