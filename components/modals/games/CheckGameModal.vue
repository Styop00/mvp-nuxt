<template>
  <BaseModalComponent v-model:visible="modal" :width="4" title="Check Game">
    <div class="p-4">
      <font-awesome
          v-if="loading"
          :icon="['fas', 'spinner']"
          class="fa-spin text-2xl"
      />
      <div v-html="checks" class="mt-4" v-else/>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  checks: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:visible',
  'reFetch',
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