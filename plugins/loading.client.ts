import { useLoading } from '@/composables/useLoading/useLoading';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export default defineNuxtPlugin(async (nuxtApp) => {
  const { setLoading } = useLoading();

  nuxtApp.$router.beforeEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      setLoading(true);
      next();
    }
  );

  nuxtApp.$router.afterEach(() => {
    setLoading(false);
  });
});
