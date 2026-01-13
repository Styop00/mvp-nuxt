<template>
  <BaseModalComponent v-model:visible="modal" @close="handleModalClose" title="Check Email">
    <div class="p-3 relative">
      <p class="mb-2 text-center">
        Please check your email for a link to reset your password.
      </p>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:visible', 'reFetch']);

const modal = ref(false);
const router = useRouter();

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
    router.push('/login');
  }
});

const closeModal = () => {
  modal.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  const modalElement = document.querySelector('.base-modal');
  if (modalElement && !modalElement.contains(event.target as Node)) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const handleModalClose = () => {
  closeModal();
};
</script>
