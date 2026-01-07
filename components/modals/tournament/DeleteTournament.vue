<template>
  <BaseModalComponent v-model:visible="modal" :width="2">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this tournament?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl"  @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 bg-red-600 rounded-xl" @onClick="remove">
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  tournamentId: {
    type: Number,
    required: true
  }
})

const {deleteTournament} = useTournamentFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:tournamentId',
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:tournamentId', 0)
    emit('update:visible', false)
  }
})

async function remove() {
  const response = await deleteTournament(props.tournamentId)

  if(response) {
    modal.value = false
  }
}

</script>