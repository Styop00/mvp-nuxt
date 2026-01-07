<template>
  <div
    class="fixed top-0 right-0 mt-6 mr-6 flex flex-col gap-3 p-3 items-center bg-yellow-100 rounded-xl"
    v-if="show"
  >
    <div class="flex gap-3 justify-between w-full">
      <font-awesome
        class="text-yellow-700"
        :icon="['fas', 'triangle-exclamation']"
      />
      <p class="text-xs text-yellow-500 max-w-60">
        {{ text }}
      </p>
      <font-awesome
        :icon="['fas', 'xmark']"
        @click="() => show=false"
        class="cursor-pointer text-yellow-700 ml-auto block"
      />
    </div>
    <button
      class="text-xs font-bold text-left w-full text-brack text-yellow-700"
      type="button"
      @click="confirmAction"
    >
      <span class="pl-7 font-inter-semibold">Confirm</span>
    </button>
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
      default: "Your changes haven't been saved. Are you sure you want to leave this page?"
    }
  })

const emit = defineEmits(['update:visible', 'confirm']);


function confirmAction() {
  emit('confirm');
}

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
