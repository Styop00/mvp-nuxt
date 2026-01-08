<template>
<div class="fixed top-0 rounded-xl right-0 mt-6 mr-6 flex gap-8 p-3 items-center justify-between bg-green-200 max-w-[calc(100vw-3rem)] z-[10000]" v-if="show" style="left: auto; right: 1.5rem;">
  <p class="text-xs text-green-700 max-w-56 break-words">
    {{ text }}
  </p>
  <font-awesome :icon="['fas', 'xmark']" @click="() => show=false" class="cursor-pointer text-green-700 ml-auto block flex-shrink-0"/>
</div>
</template>

<script setup lang="ts">

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'Success!'
  }
})

const emit = defineEmits([
  'update:visible'
])

const show = ref(false)

watch(() => props.visible, () => {
  show.value = props.visible
  if (props.visible) {
    setTimeout(() => {
      show.value = false
    }, 10000)
  }
})

watch(() => show.value, () => {
  if (!show.value) {
    emit('update:visible', false)
  }
})

</script>