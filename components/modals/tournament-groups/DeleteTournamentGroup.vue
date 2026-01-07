<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5">
        Are you sure you want to delete this tournament group?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl"  @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 bg-red-600 rounded-xl" @onClick="deleteGroup">
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  tournamentGroupId: {
    type: Number,
    required: true
  }
})

const {deleteTournamentGroup} = useTournamentGroupFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:tournamentGroupId',
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:tournamentGroupId', 0)
    emit('update:visible', false)
  }
})

async function deleteGroup() {
  const response = await deleteTournamentGroup(props.tournamentGroupId)

  if(response) {
    modal.value = false
  }
}

</script>