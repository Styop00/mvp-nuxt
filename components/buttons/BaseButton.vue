<template>
  <button
    @click="clicked"
    :type="type"
    class="px-8 py-3 bg-brand-primary-color hover:bg-brand-hover active:bg-brand-active text-white rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-brand-primary-color/30 transform hover:-translate-y-0.5 active:translate-y-0 font-medium"
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
