<template>
  <BaseModalComponent v-model:visible="modal" :width="width">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5 text-center" v-html="modalBody"/>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl"  @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl"
                    :class="showDangerConfirmation ? 'hover:!bg-white hover:!text-red-600 bg-red-600 border border-red-600': ''"
                    @onClick="emit('confirmed')">
          Confirm
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  modalBody: {
    type: String,
    required: true
  },
  showDangerConfirmation: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 2,
  }
})

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'confirmed'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

</script>