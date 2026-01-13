<template>
  <BaseModalComponent v-model:visible="modal" :width="3" title="Add to Team">
    <div class="p-4">
      <template v-if="!selectedComponent">
        <div class="min-h-40 flex flex-col items-center justify-center">
          <p class="text-center mb-7 text-xl">
            Create player or user for the club
          </p>
          <div class="flex gap-4 items-center justify-center ">
            <BaseButton
                @on-click="() => selectedComponent = AddPlayerForm"
                class="!border-brand-primary-color border !py-3 !px-6 hover:bg-dark-surface-default hover:!text-brand-primary-color"
            >
              Add Player
            </BaseButton>
            <BaseButton
                @on-click="() => selectedComponent = AddMvpUserForm"
                class="bg-dark-surface-default border hover:!bg-brand-primary-color !py-3 !px-6 border-brand-primary-color !text-brand-primary-color hover:!text-white">
              Add Tourney User
            </BaseButton>
          </div>
        </div>
      </template>
      <Component :is="selectedComponent" :clubId="clubId" @added="added" @form-close="() => modal=false"/>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import AddPlayerForm from "~/components/users/AddPlayerForm.vue"; // used dynamically by selectedComponent variable
import AddMvpUserForm from "~/components/users/AddMvpUserForm.vue"; // used dynamically by selectedComponent variable

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  clubId: {
    type: Number,
    required: true,
  }
});

const selectedComponent = shallowRef()

const modal = ref(false);

const emit = defineEmits(['update:visible', 'reFetch']);

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
    selectedComponent.value = null
  }
});

function added() {
  emit('reFetch')
}

function cancelAction() {
  modal.value = false;
}
</script>
