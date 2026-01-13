<template>
    <BaseModalComponent
      v-model:visible="modal"
      :width="4"
      :isOverflowVisible="props.isOverflowVisible"
      title="Auto Apply"
    >
      <div class="p-3 relative ">
        <div class="flex mt-4 flex-col gap-6 justify-center">
          <div class="flex gap-6">
            <Select
              :options="levelOptionsInRefereeAttachmentPage"
              v-model:value="selectedLevel"
              class="min-w-52"
            />
            <Select
              :options="refereeGameRoleIds"
              v-model:value="selectedGameRoleId"
              class="min-w-52"
            />
          </div>
          <BaseButton type="button" @click="confirmAction">Confirm</BaseButton>
        </div>
      </div>
    </BaseModalComponent>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
  import BaseButton from '~/components/buttons/BaseButton.vue';
  import { levelOptionsInRefereeAttachmentPage } from "~/constants/refereeLevelsPrio";
  import Select from '~/components/inputs/Select.vue';
  import type SelectOptions from "~/interfaces/inputs/selectOptions";
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    isOverflowVisible: {
      type:Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['update:visible', 'confirm', "refreshData"]);
  
  const modal = ref(false);
  const selectedLevel = ref({} as SelectOptions)
  const selectedGameRoleId = ref({} as SelectOptions)
  const refereeGameRoleIds: SelectOptions[] = [
    { value: "0", label: "All that is required", disabled: false },
    { value: "1", label: "Referee 1", disabled: false },
    { value: "2", label: "Referee 2", disabled: false },
    { value: "3", label: "Referee 3", disabled: false },
  ];
  
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
  
  onMounted(() => {
    selectedLevel.value = levelOptionsInRefereeAttachmentPage[0];
    selectedGameRoleId.value = refereeGameRoleIds[0]
  })
  </script>
  