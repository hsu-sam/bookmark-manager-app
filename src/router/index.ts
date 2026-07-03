import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { userRoutes } from "./private.ts";
import { publicRoutes } from "./public.ts";
import { useAuth } from "@/composables/useAuth";

declare module "vue-router" {
  interface RouteMeta {
    authless?: boolean;
    layout?: string;
  }
}

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  {
    path: "/logout",
    name: "auth.logout",
    component: () => import("../views/auth/Logout.vue"),
    meta: { authless: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/private/PageNotFound.vue"),
    name: "NotFound",
  },
  {
    path: "/",
    name: "",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "/u",
        alias: "/users",
        children: [...userRoutes],
        meta: { layout: "user" },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// / Middlewares

router.beforeEach(async (to) => {
  const { isReady, isAuthenticated, initAuth } = useAuth();

  if (!isReady.value) {
    await initAuth();
  }

  if (to.meta.authless) {
    return true;
  }

  if (!isAuthenticated.value) {
    return { name: "auth.signin" };
  }

  return true;
});
