<template>
  <button
    @click="emit('click')"
    class="p-3 my-px hover:text-brand-primary-color text-dark-text-secondary text-start rounded-lg hover:bg-dark-bg-hover text-sm flex gap-2 items-center hover:font-semibold transition-all duration-300 ease-in-out group"
    :class="{
            'w-52' : (props.showLabel || props.hovered),
            '!text-brand-primary-color bg-dark-bg-hover font-semibold border-l-2 border-brand-primary-color' : props.activeTab === props.label
          }"
  >
    <template v-if="props.icon">
      <font-awesome :icon="props.icon" class="py-1 transition-colors duration-300" :class="props.activeTab === props.label ? 'text-brand-primary-color' : 'text-dark-text-tertiary group-hover:text-brand-primary-color'"/>
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
