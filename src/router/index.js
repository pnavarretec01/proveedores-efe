import { setupLayouts } from "virtual:generated-layouts";
import { routeGuard } from "@/router/route-guard";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";
import NotFound from "@/pages/[...all].vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    { path: "/404", component: NotFound, name: "404" },
  ],
});

router.beforeEach(routeGuard);

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router;
