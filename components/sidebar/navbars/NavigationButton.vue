<template>
  <button
    @click="emit('click')"
    class="p-3 my-px text-start rounded-lg text-sm flex gap-2 items-center 
           transition-all duration-200 ease-in-out group
           text-text-secondary
           hover:text-brand-primary hover:bg-bg-hover hover:font-semibold"
    :class="{
            'w-52' : (props.showLabel || props.hovered),
            'text-brand-primary bg-bg-hover font-semibold border-l-4 border-brand-primary shadow-sm' : props.activeTab === props.label
          }"
  >
    <template v-if="props.icon">
      <font-awesome 
        :icon="props.icon" 
        class="py-1 transition-colors duration-200"
        :class="props.activeTab === props.label 
          ? 'text-brand-primary' 
          : 'text-text-tertiary group-hover:text-brand-primary'"
      />
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
