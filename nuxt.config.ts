// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: ["~/plugins/loading.client.ts", "~/plugins/theme.client.ts"],
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia-plugin-persistedstate/nuxt",
    "@vesp/nuxt-fontawesome",
    "nuxt-vue3-google-signin",
    "@nuxtjs/i18n",
  ],
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  fontawesome: {
    icons: {
      solid: [
        "bars",
        "chevron-right",
        "chevron-left",
        "calendar",
        "calendar-days",
        "gauge-high",
        "gear",
        "gavel",
        "users-rectangle",
        "stop",
        "filter",
        "list-check",
        "money-bill",
        "pen-to-square",
        "exclamation",
        "exclamation",
        "minus-circle",
        "clock",
        "landmark",
        "users",
        "spinner",
        "check",
        "user",
        "calculator",
        "circle-notch",
        "xmark",
        "arrow-right-from-bracket",
        "eye-slash",
        "eye",
        "exclamation",
        "question",
        "truck-moving",
        "envelope",
        "arrow-right",
        "arrow-left",
        "arrows-up-down",
        "pen",
        "trash-can",
        "sort",
        "angle-up",
        "angle-down",
        "magnifying-glass",
        "upload",
        "user",
        "user-tie",
        "user-group",
        "plus",
        "minus",
        "volleyball",
        "triangle-exclamation",
        "expand",
        "x",
        "location-dot",
        "arrow-down-wide-short",
        "magnifying-glass-plus",
        "paper-plane",
        "up-right-from-square",
        "shirt",
        "inbox",
        "camera",
        "key",
        "sun",
        "moon",
      ],
      regular: ["user", "circle-user", "clock", "comments", "paper-plane", "note-sticky"],
      brands: ["google"],
    },
  },
  components: false,
  app: {
    head: {
      title: "Tourney",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      script: [
        {
          // Inline script following Tailwind CSS official pattern
          // https://tailwindcss.com/docs/dark-mode#with-system-theme-support
          // Prevents FOUC (Flash of Unstyled Content) by applying theme before rendering
          children: `
            (function() {
              // Check localStorage for theme preference
              const storedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              // Determine if dark mode should be active
              // Priority: stored theme > system preference > default to dark
              let shouldBeDark;
              if (storedTheme === 'dark') {
                shouldBeDark = true;
              } else if (storedTheme === 'light') {
                shouldBeDark = false;
              } else if (!storedTheme && prefersDark) {
                shouldBeDark = true;
              } else {
                shouldBeDark = true; // Default to dark
              }
              
              // Apply dark class to html element (Tailwind's class-based dark mode)
              if (shouldBeDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
              }
              
              // Set color-scheme for browser UI
              document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
            })();
          `,
        },
      ],
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
      duration: 200,
    },
    layoutTransition: {
      name: "layout",
      mode: "out-in",
      duration: 200,
    },
  },
  runtimeConfig: {
    public: {
      apiRoute: process.env.API_ROUTE,
      backendURL: process.env.BACKEND_URL,
    },
  },
});
