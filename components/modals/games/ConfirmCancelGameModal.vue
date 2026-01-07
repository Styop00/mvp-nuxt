<template>
  <BaseModalComponent v-model:visible="modal" :width="4">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => closeModal()" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5">
        Do you want to cancel/postpone the match?.
      </p>
      <p>
        NOTE under the current circumstances with Covid-19, the match will initially be
        <span class="font-bold"> postponed </span>
        and all parties to the match will be notified. The association will then, based on their rules, decide what
        happens to the match.
      </p>
      <TextArea
          v-model:value="message"
          label="NB!! You must write a reason for below"
          class="mt-8"
          :required="true"
      />
      <p v-if="messageError" class="text-red-700 text-xs">
        {{ messageError }}
      </p>
      <div class="flex gap-6 items-center justify-center mt-4">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => closeModal()">
          Cancel
        </BaseButton>
        <BaseButton
            class="text-white font-bold py-2 px-4 rounded-xl hover:!bg-white hover:!text-red-600 bg-red-600 border border-red-600"
            @onClick="cancelTheMatch">
          Cancel/Postpone
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import TextArea from "~/components/inputs/TextArea.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  gameId: {
    type: Number,
    required: true
  },
})

const modal = ref(false)
const message = ref('')
const messageError = ref('')
const {postponeMatch} = useGamesFetch()

const emit = defineEmits([
  'update:visible',
  'cancelled'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
    message.value = ''
  }
})

async function cancelTheMatch() {
  messageError.value = ''
  if (!message.value) {
    messageError.value = 'Reason is required!'
    return
  }
  await postponeMatch(props.gameId, { message: message.value })
  emit('update:visible', false)
  emit('cancelled')
}

function closeModal() {
  modal.value=false
}

</script>