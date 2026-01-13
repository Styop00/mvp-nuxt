<template>
  <BaseModalComponent v-model:visible="modal" :width="2" title="Delete League">
    <div class="p-4">
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this league?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => modal=false">
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
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  leagueId: {
    type: Number,
    required: true
  }
})

const {deleteLeague} = useLeagueFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:leagueId',
  'reFetch',
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:leagueId', 0)
    emit('update:visible', false)
  }
})

async function remove() {
  const response = await deleteLeague(props.leagueId)

  if (response) {
    emit('reFetch')
  }
}

</script>