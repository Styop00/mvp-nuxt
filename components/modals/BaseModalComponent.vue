<template>
  <div
    v-if="position === 'top'"
    class="fixed top-0 left-0 right-0 z-[10000] flex justify-center pt-4"
    style="pointer-events: none;"
  >
    <div
      @click.stop
      :id="'modal-body' + name"
      :class="[
        'bg-dark-surface-default border border-dark-border-default p-3 rounded-2xl small-scrollbar shadow-xl',
        widthStyles,
        isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'
      ]"
      style="pointer-events: auto; max-width: calc(100vw - 2rem);"
      v-show="visible">
      <slot />
    </div>
  </div>
  <div
    v-else
    class="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[9999] overflow-hidden"
    v-show="visible"
    @click="() => modal = false"
  >
    <div
      @click.stop
      :id="'modal-body' + name"
      :class="[
        'bg-dark-surface-default border border-dark-border-default absolute p-3 rounded-2xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 small-scrollbar shadow-xl',
        widthStyles,
        isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'
      ]"
      style="max-height: 80vh; max-width: calc(100vw - 2rem);">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 3,
  },
  name: {
    type: String,
    default: '',
  },
  isOverflowVisible: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'center', // 'center' or 'top'
  }
})

const emit = defineEmits([
  'update:visible'
])

const modal = ref(false)

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})
const widthStyles = computed(() => {
  switch (props.width) {
    case 1 :
      return 'w-[200px] max-w-[calc(100vw-2rem)]';
    case 2 :
      return 'w-[350px] max-w-[calc(100vw-2rem)]';
    case 3 :
      return 'w-[500px] max-w-[calc(100vw-2rem)]';
    case 4 :
      return 'w-[700px] max-w-[calc(100vw-2rem)]';
    case 5 :
      return 'w-[900px] max-w-[calc(100vw-2rem)]';
    default :
      return 'w-[1500px] max-w-[calc(100vw-2rem)]';
  }
})
</script>
