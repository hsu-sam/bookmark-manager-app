import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: "home",
    component: () => import("@/views/private/DashboardIndex.vue"),
    name: "user.index",
  },
  {
    path: "archived",
    component: () => import("@/views/private/ArchivedIndex.vue"),
    name: "user.archived",
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/private/PageNotFound.vue"),
    name: "NotFound",
  },
];
