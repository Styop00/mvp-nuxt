<template>
  <button
    @click="clicked"
    :type="type"
    class="px-8 py-3 bg-brand-primary-color hover:bg-brand-secondary-color hover:text-brand-primary-color text-white rounded-lg transition-colors duration-200 ease-in-out delay-15"
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
