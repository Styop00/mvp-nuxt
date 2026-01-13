<template>
  <BaseModalComponent v-model:visible="modal" :width="3" title="Delete Reservation">
    <div class="p-4">
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this reservation?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton
            class="text-white font-bold py-2 px-4 bg-red-600 rounded-xl"
            @onClick="deleteReservation"
        >
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useReservationsFetch} from "~/composables/useReservationsFetch/useReservationsFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  reservationId: {
    type: Number,
    required: true
  }
})

const {deleteReservationById} = useReservationsFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:reservationId',
  'deleted'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:reservationId', 0)
    emit('update:visible', false)
  }
})

async function deleteReservation() {
  const response = await deleteReservationById(props.reservationId)

  if (response) {
    emit('deleted')
    modal.value = false
  }
}

</script>