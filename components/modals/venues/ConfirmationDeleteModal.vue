<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <p class="text-lg text-center mb-4">{{ message }}</p>
      <div class="flex justify-center">
        <BaseButton
          type="button"
          class="bg-red-500 text-white mr-2"
          @click="cancelAction"
          >Cancel</BaseButton
        >
        <BaseButton type="button" @click="confirmAction">Confirm</BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
});

const emit = defineEmits(['update:visible', 'confirm', "refreshData"]);

const modal = ref(false);

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

function confirmAction() {
  emit('confirm');
  modal.value = false;
   emit('refreshData');
}

function cancelAction() {
  modal.value = false;
}
</script>
