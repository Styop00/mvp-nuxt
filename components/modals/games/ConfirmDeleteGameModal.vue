<template>
  <BaseModalComponent v-model:visible="modal" :width="2">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this game?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl"  @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl hover:!bg-white hover:!text-red-600 bg-red-600 border border-red-600"
                    @onClick="deleteMatch">
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";

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
const {deleteGame} = useGamesFetch()

const emit = defineEmits([
  'update:visible',
  'deleted'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

async function deleteMatch() {
  await deleteGame(props.gameId)
  emit('update:visible', false)
  emit('deleted')
}

</script>