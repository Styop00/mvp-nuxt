<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4  ">
      <div class="flex justify-between items-center mb-3 py-3 border-b">
        <p class="font-bold">Create a new Coach</p>
        <font-awesome
          :icon="['fas', 'xmark']"
          @click="() => modal = false"
          class="cursor-pointer"
        />
      </div>
      <form action="#" @submit.prevent="create">
        <div class="flex-col ">
          <TextInput
            v-model:value="name"
            label="Name"
            :required="true"
            placeholder="Name"
            class="mb-4"
          />
          <TextInput
            v-model:value="email"
            label="Email"
            :required="true"
            type="email"
            placeholder="Email"
          />
        </div>
        <BaseButton class="!py-2 block mt-4 mx-auto"> Save </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useCoachesFetch } from '~/composables/useCoachesFetch/useCoachesFetch';

const props = defineProps({
  visible: Boolean,

});

const { createCoach } = useCoachesFetch()

const emit = defineEmits(['update:visible', 'refreshData']);

const modal = ref(props.visible);
const name = ref('');
const email = ref('');

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, (newVal) => {
  if (!newVal) {
    resetModal();
    emit('update:visible', false);
  }
});

function resetModal() {
  name.value = '';
  email.value = '';
}

async function create() {
  const response = await createCoach(name.value, email.value)

  if (response) {
    modal.value = false;
    emit('refreshData');
  }
}
</script>
