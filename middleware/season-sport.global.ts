import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip for public routes and complete-profile page itself
  if (to.meta.publicRoute || to.path === '/complete-profile') {
    return;
  }

  let user = null;

  if (import.meta.server) {
    const res = await useFetch('/api/auth-user');
    if (res?.data?.value) {
      // On server, we need to fetch full user data
      return;
    }
  } else {
    const store = useUserStore();
    user = store.user;
  }

  // If user is logged in but has no season_sports, redirect to complete-profile
  if (user && user.id) {
    const seasonSports = user.season_sports || [];
    
    if (seasonSports.length === 0) {
      return navigateTo('/complete-profile');
    }
  }
});

