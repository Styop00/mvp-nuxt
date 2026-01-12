<template>
  <button
    @click="clicked"
    :type="type"
    class="px-8 py-3 
           bg-brand-primary hover:bg-brand-hover active:bg-brand-active 
           text-white 
           rounded-lg 
           transition-all duration-200 ease-in-out 
           shadow-sm hover:shadow-md 
           hover:shadow-brand-primary/30 
           transform hover:-translate-y-0.5 active:translate-y-0 
           font-medium
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    default: 'submit',
  }
})
const emit = defineEmits(['onClick'])
function clicked() {
  emit('onClick')
}
</script>
