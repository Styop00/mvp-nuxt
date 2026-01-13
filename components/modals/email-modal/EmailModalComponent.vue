<template>
  <BaseModalComponent v-model:visible="modal" :position="'top'" title="Check Email">
    <div class="p-3 relative">
      <p class="mb-2 text-center">
        This email doesn't have a password. Please check your email for a link to
        create a new password.
      </p>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits([
  'update:visible',
  'reFetch'
])

const modal = ref(false)

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})
</script>
