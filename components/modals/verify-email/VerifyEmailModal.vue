<template>
  <BaseModalComponent v-model:visible="modal" @close="handleModalClose">
    <div class="p-3 relative">
      <font-awesome
        :icon="['fas', 'xmark']"
        @click="closeModal"
        class="text-xl cursor-pointer absolute right-0.5 top-0"
      />
      <h2 class="mb-2 text-center">Check Email</h2>
      <p class="mb-2 text-center">
        Please check your email for a link to verify your account.
      </p>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import { useRouter } from 'vue-router';

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
