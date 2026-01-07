<template>
  <button
    @click="emit('click')"
    class="p-3 my-px hover:text-brand-primary-color text-white text-start rounded-lg hover:bg-brand-secondary-color text-sm flex gap-2 items-center hover:font-bold"
    :class="{
            'w-52' : (props.showLabel || props.hovered),
            '!text-brand-primary-color bg-brand-secondary-color font-bold' : props.activeTab === props.label
          }"
  >
    <template v-if="props.icon">
      <font-awesome :icon="props.icon" class="py-1" :class="props.activeTab === props.label ? 'text-brand-primary-color' : ''"/>
    </template>
    <template v-if="props.showLabel || props.hovered">
      {{ props.label }}
    </template>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: Array as () => string[],
    default: null
  },
  label: String,
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
  }
})

const emit = defineEmits(['click'])
</script>
