<template>
  <BaseModalComponent v-model:visible="modal" :width="6">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold mb-5 border-b">
        Create a new tournament
      </p>
      <EditTournamentForm :data="data" ref="editForm" @updated="emitUpdated" class="p-0"/>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import EditTournamentForm from "~/components/tournament/EditTournamentConfigForm.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as () => TournamentConfigs,
    default: {}
  }
})
const editForm = ref<InstanceType<typeof EditTournamentForm> | null>(null)

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'updated'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

onMounted(() => {
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.addEventListener('click', modalClicked)
  }
})

function modalClicked() {
  if (editForm.value) {
    editForm.value.closeCalendars()
  }
}

function emitUpdated() {
  emit('updated')
  if (editForm.value) {
    editForm.value.resetForm()
    modalClicked()
  }
  modal.value = false
}

</script>