<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <p class="text-lg text-center mb-4">{{ message }}</p>
      <div>
        <CheckBox
          v-model:value="chkNoMoreGames1"
          label="Put at the back of the queue for battle"
          name="Put at the back of the queue for battle"
        />
        <CheckBox
          v-model:value="chkNoMoreGames2"
          label="Put at the back of the queue for matches on the same day"
          name="Put at the back of the queue for matches on the same day"
        />
      </div>
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
import CheckBox from '~/components/inputs/CheckBox.vue';

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
const chkNoMoreGames1 = ref(false);
const chkNoMoreGames2 = ref(false);

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

function confirmAction() {
  emit('confirm', chkNoMoreGames1.value, chkNoMoreGames2.value);
  modal.value = false;
  emit('refreshData');
}

function cancelAction() {
  modal.value = false;
}
</script>
