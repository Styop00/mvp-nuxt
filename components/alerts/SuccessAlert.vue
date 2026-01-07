<template>
<div class="fixed top-0 rounded-xl right-0 mt-6 mr-6 flex gap-8 p-3 items-center justify-between bg-green-200" v-if="show">
  <p class="text-xs text-green-700 max-w-56">
    {{ text }}
  </p>
  <font-awesome :icon="['fas', 'xmark']" @click="() => show=false" class="cursor-pointer text-green-700 ml-auto block"/>
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