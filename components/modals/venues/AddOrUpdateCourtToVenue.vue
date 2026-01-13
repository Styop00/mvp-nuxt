<template>
  <BaseModalComponent v-model:visible="modal" :width="3" :title="props.court ? `Edit Court (${props.venueName})` : `Create a new Court (${props.venueName})`">
    <div class="p-4">
      <div class="mb-4">
        <TextInput
          label="Court Name"
          v-model:value="courtName"
          placeholder="Enter Court Name"
          type="text"
          class="w-full mb-1"
          required
        />
        <div
          v-if="localErrorMessage"
          class="text-red-500 text-start mb-4 text-xs"
        >
          {{ localErrorMessage }}
        </div>
      </div>

      <div class="flex gap-2 justify-between">
        <div class="mb-4 w-full">
          <TextInput
            label="Liga/Div"
            v-model:value="courtRequirement1 "
            placeholder="Enter Liga/Div"
            type="number"
            class="w-full mb-1"
            @input="validatePositiveNumber($event, 'courtRequirement1')"
          />
          <div
            v-if="courtRequirement1Error"
            class="text-red-500 text-start mb-4 text-xs"
          >
            {{ courtRequirement1Error }}
          </div>
        </div>
        <div class="mb-4 w-full">
          <TextInput
            label="Late Youth"
            v-model:value="courtRequirement2"
            placeholder="Enter Late Youth"
            type="number"
            class="w-full mb-1"
            @input="validatePositiveNumber($event, 'courtRequirement2')"
          />
          <div
            v-if="courtRequirement2Error"
            class="text-red-500 text-start mb-4 text-xs"
          >
            {{ courtRequirement2Error }}
          </div>
        </div>
      </div>

      <div class="flex gap-2 justify-between">
        <div class="mb-4 w-full">
          <TextInput
            label="Others"
            v-model:value="courtRequirement3"
            placeholder="Enter Others"
            type="number"
            class="w-full mb-1"
            @input="validatePositiveNumber($event, 'courtRequirement3')"
          />
          <div
            v-if="courtRequirement3Error"
            class="text-red-500 text-start mb-4 text-xs"
          >
            {{ courtRequirement3Error }}
          </div>
        </div>
        <div class="mb-4 w-full">
          <TextInput
            label="Mini"
            v-model:value="courtRequirement4"
            placeholder="Enter Mini"
            type="number"
            class="w-full mb-1"
            @input="validatePositiveNumber($event, 'courtRequirement4')"
          />
          <div
            v-if="courtRequirement4Error"
            class="text-red-500 text-start mb-4 text-xs"
          >
            {{ courtRequirement4Error }}
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <BaseButton
          type="button"
          class="bg-red-600 text-white mr-2"
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
import TextInput from '~/components/inputs/TextInput.vue';
import { useCourtsFetch } from '~/composables/useCourtsFetch/useCourtsFetch'

const props = defineProps({
  venueName: String,
  visible: Boolean,
  id: Number,
  court: {},
  venueId: Number,
  message: String,
  showErrorAlert: Boolean,
  errorMessage: String,
});

const { fetchCourtById } = useCourtsFetch()

const localErrorMessage = ref(props.errorMessage || '');
const modal = ref(false);
const courtName = ref('');
const courtRequirement1 = ref<number | null>(null);
const courtRequirement2 = ref<number | null>(null);
const courtRequirement3 = ref<number | null>(null);
const courtRequirement4 = ref<number | null>(null);

const courtRequirement1Error = ref('');
const courtRequirement2Error = ref('');
const courtRequirement3Error = ref('');
const courtRequirement4Error = ref('');

const emit = defineEmits(['update:visible', 'confirm', 'refreshData', 'courtUpdate', 'courtCreate']);

watch(() => props.visible, async () => {
  modal.value = props.visible;


      courtName.value = props.court?.name;

      const courtUsages = props.court?.courtUsages || [];

      courtRequirement1.value = courtUsages.find(
        (usage) => usage.courtRequirementId === 1
      )?.courtUsageCount ?? null;

      courtRequirement2.value = courtUsages.find(
        (usage) => usage.courtRequirementId === 2
      )?.courtUsageCount ?? null;

      courtRequirement3.value = courtUsages.find(
        (usage) => usage.courtRequirementId === 3
      )?.courtUsageCount ?? null;

      courtRequirement4.value = courtUsages.find(
        (usage) => usage.courtRequirementId === 4
      )?.courtUsageCount ?? null;

});

function validatePositiveNumber(event: Event, field: string) {
  const inputElement = event.target as HTMLInputElement;
  const value = parseInt(inputElement.value, 10);

  if (value < 0) {
    inputElement.value = '';
    switch (field) {
      case 'courtRequirement1':
        courtRequirement1Error.value = 'Please enter a positive number.';
        courtRequirement1.value = null;
        break;
      case 'courtRequirement2':
        courtRequirement2Error.value = 'Please enter a positive number.';
        courtRequirement2.value = null;
        break;
      case 'courtRequirement3':
        courtRequirement3Error.value = 'Please enter a positive number.';
        courtRequirement3.value = null;
        break;
      case 'courtRequirement4':
        courtRequirement4Error.value = 'Please enter a positive number.';
        courtRequirement4.value = null;
        break;
    }
  } else {
    resetError(field);
  }
}

function resetError(field: string) {
  switch (field) {
    case 'courtRequirement1':
      courtRequirement1Error.value = '';
      break;
    case 'courtRequirement2':
      courtRequirement2Error.value = '';
      break;
    case 'courtRequirement3':
      courtRequirement3Error.value = '';
      break;
    case 'courtRequirement4':
      courtRequirement4Error.value = '';
      break;
  }
}

function resetForm() {
  courtName.value = '';
  courtRequirement1.value = null;
  courtRequirement2.value = null;
  courtRequirement3.value = null;
  courtRequirement4.value = null;
  courtRequirement1Error.value = '';
  courtRequirement2Error.value = '';
  courtRequirement3Error.value = '';
  courtRequirement4Error.value = '';
  localErrorMessage.value = '';
}

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

watch(() => props.errorMessage, (newMessage) => {
  localErrorMessage.value = newMessage as string;
});

async function confirmAction() {
  localErrorMessage.value = '';

  if (courtName.value) {
    const courtData = {
      name: courtName.value,
      venueId: props.venueId
    };

    if (props.court) {
      emit('courtUpdate',
        props.court.id,
        courtName.value,
        courtRequirement1.value,
        courtRequirement2.value,
        courtRequirement3.value,
        courtRequirement4.value
      );
    } else {
      emit('courtCreate',
        courtName.value,
        courtRequirement1.value,
        courtRequirement2.value,
        courtRequirement3.value,
        courtRequirement4.value
      );
    }
    cancelAction();
  } else {
    localErrorMessage.value = 'Court name cannot be empty.';
  }
}

function cancelAction() {
  resetForm();
  modal.value = false;
  emit('update:visible', false);
}
</script>
