<template>
  <div class="relative my-3 mr-2 ">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      class="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <font-awesome
      :icon="['fas', 'magnifying-glass']"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
