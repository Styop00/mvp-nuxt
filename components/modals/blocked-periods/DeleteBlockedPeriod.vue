<template>
  <BaseModalComponent v-model:visible="modal" :width="3" title="Delete Blocked Period">
    <div class="p-4">
      <p class="font-bold my-5 text-center">
        Are you sure you want to delete this period?
      </p>
      <div class="flex gap-6 items-center justify-center">
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton
            class="text-white font-bold py-2 px-4 bg-red-600 rounded-xl"
            @onClick="deleteBlockedPeriod"
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
import {useBlockedPeriodsFetch} from "~/composables/useBlockedPeriodsFetch/useBlockedPeriodsFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  blockedPeriodId: {
    type: Number,
    required: true
  }
})

const {deleteBlockedPeriodById} = useBlockedPeriodsFetch()

const modal = ref(false)

const emit = defineEmits([
  'update:visible',
  'update:blockedPeriodId',
  'deleted'
])

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:blockedPeriodId', 0)
    emit('update:visible', false)
  }
})

async function deleteBlockedPeriod() {
  const response = await deleteBlockedPeriodById(props.blockedPeriodId)

  if (response) {
    emit('deleted')
    modal.value = false
  }
}

</script>