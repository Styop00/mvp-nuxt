<template>
  <div>
    <div
      class="flex justify-between group items-center my-px p-3 hover:text-brand-primary-color hover:font-bold text-white rounded-lg hover:bg-brand-secondary-color text-sm cursor-pointer"
      :class="{
        '!text-brand-primary-color bg-brand-secondary-color font-bold': props.activeTab === props.label,
        'w-[213px]': props.showLabel || props.hovered,
        'w-full': !(props.showLabel || props.hovered),
      }"
      @click="toggleNavigation"
    >
      <div class="flex gap-2 items-center">
        <font-awesome :icon="props.icon" class="py-1" :class="props.activeTab === props.label ? 'text-brand-primary-color' : ''" />
        <template v-if="props.showLabel || props.hovered">
          {{ $t(props.label.toLowerCase()) }}
        </template>
      </div>
      <font-awesome
        :icon="['fas', 'chevron-right']"
        :class="{'rotate-90': isGroupOpen, '!text-brand-primary-color': props.activeTab === props.label, 'hidden': !(showLabel || hovered)}"
        class="group-hover:!text-brand-primary-color text-white text-xxs"
      />
    </div>

    <div class="overflow-hidden ml-3" v-if="isGroupOpen">
      <template v-for="childRoute in props.children" :key="childRoute.label">
        <button
          @click="handleChildClick(childRoute)"
          class="p-2 px-3 my-px text-xs group hover:text-brand-primary-color hover:font-bold text-white hover:bg-brand-secondary-color rounded-lg text-start w-full flex items-center gap-4"
          :class="{'!text-brand-primary-color bg-brand-secondary-color font-bold': props.activeTab === childRoute.label}"
        >
          <span class="block w-1 h-1 rounded-full border border-white group-hover:border-brand-primary-color"
                :class="{'!border-brand-primary-color': props.activeTab === childRoute.label}"
          />
          {{ $t(childRoute.label.toLowerCase()) }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  openedNavigations: {
    type: Array<String>,
    default: ''
  },
  icon: {
    type: Array as () => string[],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  children: {
    type: Array as () => Array<Object>,
    default: []
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  hovered: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    default: 'Dashboard'
  },
});

const emit = defineEmits(['click', 'childClick']);

const manuallyOpened = ref(false);

watch(() => props.openedNavigations, () => {
  manuallyOpened.value = props.openedNavigations.includes(props.label);
}, {
  deep: true,
  immediate: true
})

const isGroupOpen = computed(() => {
  return manuallyOpened.value && (props.showLabel || props.hovered)
})

function toggleNavigation() {
  emit('click', props.label)
  manuallyOpened.value = !(props.openedNavigations.includes(props.label));
}

function handleChildClick(childRoute: any) {
  emit('childClick', childRoute);
}
</script>
