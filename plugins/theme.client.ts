/**
 * Theme Plugin
 * Ensures dark theme is always applied to the HTML element
 * Prevents flash of unstyled content (FOUC)
 */
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Apply dark class immediately before any rendering
    const html = document.documentElement;
    html.classList.add('dark');
    
    // Set background immediately to prevent white flash
    html.style.backgroundColor = '#0F172A';
    document.body.style.backgroundColor = '#0F172A';
    document.body.style.color = '#F8FAFC';
    
    // Set color scheme
    html.style.colorScheme = 'dark';
    
    // Watch for route changes and ensure dark theme persists
    const router = useRouter();
    router.afterEach(() => {
      html.classList.add('dark');
      html.style.backgroundColor = '#0F172A';
      document.body.style.backgroundColor = '#0F172A';
    });
  }
});

