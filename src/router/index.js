import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "",
    redirect: "/meters",
  },
  {
    path: "/meters",
    component: () => import("../views/Meters.vue"),
  },
  {
    path: "/meters/add",
    component: () => import("../views/AddMeter.vue"),
  },
  {
    path: "/usage",
    component: () => import("../views/Usage.vue"),
  },
  {
    path: "/about",
    component: () => import("../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
