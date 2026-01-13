<template>
  <BaseModalComponent v-model:visible="modal" :width="3" :title="id ? 'Edit Federation' : 'Create a new Federation'">
    <div class="p-4">
      <form action="#" @submit.prevent="createOrUpdate">
        <div class="flex-col ">
          <TextInput
            v-model:value="name"
            label="Name"
            :required="true"
            placeholder="Name"
            class="mb-4"
          />
          <TextInput
            v-model:value="invoicePrefix"
            label="Invoice Prefix"
            :required="true"
            placeholder="Invoice Prefix"
          />
        </div>
        <BaseButton class="!py-2 block mt-4 mx-auto">
          {{ id ? 'Edit' : 'Create' }}
        </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useApiV5Fetch } from '~/composables/useApiV5Fetch';

const props = defineProps({
  visible: Boolean,
  id: Number,
  name: String,
  invoicePrefix: String,
});

const emit = defineEmits(['update:visible', 'refreshData']);

const modal = ref(false);
const name = ref(props.name || '');
const invoicePrefix = ref(props.invoicePrefix || '');

watch(() => props.visible, (newVal) => {
  modal.value = newVal;
  if (newVal) {
    name.value = props.name || '';
    invoicePrefix.value = props.invoicePrefix || '';
  }
});

watch(() => modal.value, (newVal) => {
  if (!newVal) {
    resetModal();
    emit('update:visible', false);
  }
});

function resetModal() {
  name.value = '';
  invoicePrefix.value = '';
}

async function createOrUpdate() {
  const method = props.id ? 'PUT' : 'POST';
  const endpoint = props.id ? `organizers/${props.id}` : 'organizers';
  const response = await useApiV5Fetch(endpoint, {
    method,
    body: {
      name: name.value,
      invoicePrefix: invoicePrefix.value,
    },
  });

  if (response.data.value) {
    modal.value = false;
    emit('refreshData');
  }
}
</script>
