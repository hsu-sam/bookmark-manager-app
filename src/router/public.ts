import type { RouteRecordRaw } from "vue-router";

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/auth/SignIn.vue"),
    name: "auth.signin",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/signup",
    component: () => import("@/views/auth/SignUp.vue"),
    name: "auth.signup",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/forgot-password",
    component: () => import("@/views/auth/ForgotPassword.vue"),
    name: "auth.forgot-password",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/reset-password",
    component: () => import("@/views/auth/ResetPassword.vue"),
    name: "auth.reset-password",
    meta: { layout: "auth", authless: true },
  },
];
