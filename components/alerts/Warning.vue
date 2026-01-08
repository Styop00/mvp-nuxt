<template>
  <div class="w-full rounded-md items-center shadow-[0_0_15px_#00000014] overflow-hidden bg-amber-400 pl-1">
    <p class="bg-dark-surface-default text-brand-gray p-2.5 rounded-md" v-html="text"/>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  }
})
</script>
