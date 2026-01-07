<template>
  <nav class="mb-4 ml-2 text-[14px]">
    <ol>
      <li>
        <nuxt-link
          to="/"
          class="text-gray-500 cursor-pointer hover:text-brand-primary-color"
        >
          <span property="name">Home</span>
        </nuxt-link>
      </li>

      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <nuxt-link
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="text-gray-500 hover:text-brand-primary-color"
        >
          <span property="name">{{ crumb.label }}</span>
        </nuxt-link>
        <span v-else class="text-gray-900">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const fullPath = route.path;
  const segments = fullPath.split('/').filter(Boolean);

  const crumbs = [];
  let path = '';

  segments.forEach((segment, index) => {
    if (index === 0 && segment.toLowerCase() === 'tournament') {
      path += `/${segment}`;
      return;
    }

    if (index === 0 && segment.toLowerCase() === 'super-admin') {
      path += `/${segment}`;
      return;
    }

    if (index === 0 && segment.toLowerCase() === 'coaches') {
      path += `/${segment}`;
      return;
    }

    if (index === 0 && segment.toLowerCase() === 'referees') {
      path += `/${segment}`;
      return;
    }

    const label = segment
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');


    path += `/${segment}`;

    if (!isNaN(Number(segment)) && index !== segments.length - 1) {
      return;
    }

    crumbs.push({
      label,
      path,
    });
  });

  return crumbs;
});
</script>

<style scoped>
ol {
  list-style: none;
  padding: 0;
}

li {
  display: inline;
}

li:after {
  content: '  »  ';
  color: #aaa;
  padding: 0 8px;
}

li:last-child:after {
  content: '';
}
</style>
