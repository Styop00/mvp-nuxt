<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      class="px-3 py-2.5 pl-10 border min-h-11 border-border-default bg-bg-primary text-sm text-text-primary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 placeholder:text-text-tertiary placeholder:text-xs hover:border-border-light hover:shadow-sm"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from '~/utils/debounce';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref(props.modelValue);

const debouncedEmitSearch = debounce((query: string) => {
  emit('update:modelValue', query);
}, 1000);

watch(searchQuery, (newQuery) => {
  debouncedEmitSearch(newQuery);
});
</script>
