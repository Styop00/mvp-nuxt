<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this team?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 bg-red-600 rounded-xl" @onClick="deleteTeam">
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  teamId: {
    type: Number,
    required: true
  }
})

const {deleteTeamById} = useTeamsFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:teamId',
  'deleted'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:teamId', 0)
    emit('update:visible', false)
  }
})

async function deleteTeam() {
  const response = await deleteTeamById(props.teamId)

  if (response) {
    emit('deleted')
    modal.value = false
  }
}

</script>