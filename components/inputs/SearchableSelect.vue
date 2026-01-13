<template>
  <div class="w-full relative text-sm" ref="selectContainer">
    <p class="font-inter-medium text-text-primary mb-1">
      {{ label }}
      <span v-if="required && label" class="text-red-500">*</span>
    </p>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="px-3 py-2.5 border min-h-11 border-border-default bg-bg-primary text-sm text-text-primary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 placeholder:text-text-tertiary hover:border-border-light hover:shadow-sm"
        @focus="openDropdown"
        @input="handleInput"
        @keydown.escape="closeDropdown"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
      />
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <font-awesome :icon="['fas', 'spinner']" class="animate-spin text-text-tertiary" />
      </div>
    </div>
    <Transition name="dropdown">
      <div
        v-if="dropdownOpened && (filteredOptions.length > 0 || searchQuery.length > 0)"
        class="absolute shadow-sm border border-border-default w-full text-sm max-h-52 overflow-y-auto small-scrollbar bg-surface-elevated rounded-lg mt-1 !z-[9999]"
      >
        <div
          v-if="isLoading"
          class="px-3 py-2.5 text-text-tertiary text-center"
        >
          Searching...
        </div>
        <div
          v-else-if="filteredOptions.length === 0 && searchQuery.length > 0"
          class="px-3 py-2.5 text-text-tertiary text-center"
        >
          No results found
        </div>
        <template v-else>
          <div
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="px-3 py-2.5 border-b border-border-default last:border-b-0 text-sm text-text-primary bg-surface-elevated transition-all duration-200 cursor-pointer hover:bg-bg-hover hover:text-brand-primary"
            :class="index === highlightedIndex ? 'bg-bg-hover text-brand-primary' : ''"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            {{ option.label }}
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { PropType } from 'vue';

export interface SearchableSelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

// Export the type for use in other components
export type { SearchableSelectOption };

const props = defineProps({
  modelValue: {
    type: Object as PropType<SearchableSelectOption | null>,
    default: null
  },
  options: {
    type: Array<SearchableSelectOption>,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  required: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  minSearchLength: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const selectContainer = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const dropdownOpened = ref(false);
const highlightedIndex = ref(-1);

const filteredOptions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < props.minSearchLength) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query) && !option.disabled
  );
});

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    searchQuery.value = newValue.label;
  } else {
    searchQuery.value = '';
  }
}, { immediate: true });

function handleInput() {
  if (searchQuery.value.length >= props.minSearchLength) {
    emit('search', searchQuery.value);
    if (!dropdownOpened.value) {
      dropdownOpened.value = true;
    }
  } else {
    dropdownOpened.value = false;
  }
  highlightedIndex.value = -1;
}

function selectOption(option: SearchableSelectOption) {
  if (!option.disabled) {
    searchQuery.value = option.label;
    emit('update:modelValue', option);
    closeDropdown();
    // Clear the search to show only the selected value
    highlightedIndex.value = -1;
  }
}

function selectHighlighted() {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
}

function highlightNext() {
  if (filteredOptions.value.length > 0) {
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length;
  }
}

function highlightPrev() {
  if (filteredOptions.value.length > 0) {
    highlightedIndex.value = highlightedIndex.value <= 0 
      ? filteredOptions.value.length - 1 
      : highlightedIndex.value - 1;
  }
}

function openDropdown() {
  if (searchQuery.value.length >= props.minSearchLength) {
    dropdownOpened.value = true;
  }
}

function closeDropdown() {
  dropdownOpened.value = false;
  highlightedIndex.value = -1;
}

function handleClickOutside(event: MouseEvent) {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 200ms ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>

