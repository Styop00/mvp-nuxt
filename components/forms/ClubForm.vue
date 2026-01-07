<template>
  <div class="md:p-6">
    <form @submit.prevent="saveClub" class="space-y-6">
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Club Name"
          v-model:value="club.name"
          placeholder="Enter club name"
          type="text"
          class="w-full "
          required
        />
        <div class="flex gap-3 w-full">
          <TextInput
            label="Abbreviation"
            v-model:value="club.shortName"
            placeholder="Enter club name"
            type="text"
            class="w-full "
            required
          />
        </div>
      </div>

      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Country"
          v-model:value="club.country"
          placeholder="Country"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.country) ? '!border-red-500' : ''"
        />
        <TextInput
          label="City"
          v-model:value="club.postalCity"
          placeholder="City"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.postalCity) ? '!border-red-500' : ''"
        />
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Address Line 1"
          v-model:value="club.addressLine1"
          placeholder="Address Line 1"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.addressLine1) ? '!border-red-500' : ''"
        />
        <TextInput
          label="Address Line 2"
          v-model:value="club.addressLine2"
          placeholder="Address Line 2"
          type="text"
          class="w-full"
        />
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Building"
          v-model:value="club.building"
          placeholder="Building"
          type="text"
          class="w-full"
        />
        <TextInput
          label="Postal Code"
          v-model:value="club.postalCode"
          placeholder="Postal Code"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.postalCode) ? '!border-red-500' : ''"
        />
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <div class="flex flex-col w-full">
          <TextInput
            label="Phone Number 1"
            v-model:value="club.phoneNumber1"
            placeholder="Phone Number 1"
            type="text"
            class="w-full"
          />
          <p v-if="phoneValidationError1" class="text-red-700 text-xs mt-2">
            {{ phoneValidationError1 }}
          </p>
        </div>
        <div class="flex flex-col w-full">
          <TextInput
            label="Phone Number 2"
            v-model:value="club.phoneNumber2"
            placeholder="Phone Number 2"
            type="text"
            class="w-full"
          />
          <p v-if="phoneValidationError2" class="text-red-700 text-xs mt-2">
            {{ phoneValidationError2 }}
          </p>
        </div>
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Club Email"
          v-model:value="club.email"
          placeholder="Club Email"
          type="email"
          class="w-full"
        />
        <TextInput
          label="Web Address"
          v-model:value="club.webAddress"
          placeholder="Web address"
          type="text"
          class="w-full"
        />
      </div>
      <div
        v-if="clubId"
        class="flex flex-col xl:flex-row gap-4 w-full md:w-2/3"
      >
        <CheckBox v-model:value="club.isActive" label="Active" name="Active" />
      </div>
      <div class="flex flex-col gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextArea
          v-model:value="club.publicNotes"
          label="Public info"
          class=""
        />
        <TextArea
          v-model:value="club.internalNotes"
          label="Internal note"
          class=""
        />
      </div>
      <div class="flex justify-start mt-4">
        <BaseButton
          class="text-white font-bold py-2 px-4 rounded"
          :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
      <p v-if="addressValidationError" class="text-red-700 text-xs">
        {{ addressValidationError }}
      </p>
    </form>
    <SuccessAlert
      v-model:visible="showSuccessAlertCreate"
      text="The new Club has been successfully created."
    />
    <SuccessAlert
      v-model:visible="showSuccessAlertUpdate"
      text="Club has been successfully updated."
    />
  </div>
</template>

<script setup lang="ts">
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import CheckBox from '~/components/inputs/CheckBox.vue';
import { useClubsFetch } from '~/composables/useClubsFetch/useClubsFetch';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import type Clubs from '~/interfaces/clubs/club';
import TextArea from "~/components/inputs/TextArea.vue";


const loading = ref(false)

const showSuccessAlertCreate = ref(false)
const showSuccessAlertUpdate = ref(false)
const props = defineProps({
  clubId: Number,
  showDisabledInputs: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['clubSaved', 'unsavedChanges']);


const { updateClub, createClub } = useClubsFetch();

const club = ref<Partial<Clubs>>({});


const addressValidationError = ref('');

function validateAddressFields() {
  const { addressLine1, postalCode, postalCity, country } = club.value;
  if (
    (addressLine1 || postalCode || postalCity || country) &&
    (!addressLine1 || !postalCode || !postalCity || !country)
  ) {
    addressValidationError.value = 'Please fill all address-related fields (Address Line 1, Postal Code, Postal City, Country).';
    return false;
  }

  addressValidationError.value = '';
  return true;
}

const showRedBorders = computed(() => {
  return !!(club.value.addressLine1 || club.value.postalCity || club.value.country || club.value.postalCode);
})

const phoneValidationError1 = ref('');
const phoneValidationError2 = ref('');

function validatePhoneNumber() {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  const { phoneNumber1, phoneNumber2 } = club.value;

  let isValid = true;

  if (phoneNumber1 && !phoneRegex.test(phoneNumber1)) {
    phoneValidationError1.value = 'Please enter a valid phone number in E.164 format (e.g., +123456789012345).';
    isValid = false;
  } else {
    phoneValidationError1.value = '';
  }

  if (phoneNumber2 && !phoneRegex.test(phoneNumber2)) {
    phoneValidationError2.value = 'Please enter a valid phone number in E.164 format (e.g., +123456789012345).';
    isValid = false;
  } else {
    phoneValidationError2.value = '';
  }

  return isValid;
}

async function fetchClub(id: number) {
  const response = await useApiV5Fetch(`clubs/${id}`);
  if (response.data?.value) {
    club.value = response.data.value;
  } else {
    console.error('Club data not found for ID:', id);
  }
}

async function saveClub() {
  loading.value = true

  if (!validateAddressFields() || !validatePhoneNumber()) {
    loading.value = false;
    return;
  }

  try {
    if (props.clubId) {
      const response = await updateClub(props.clubId, {...club.value});
      if (response) {
      showSuccessAlertUpdate.value = true
      loading.value = false
      emit('unsavedChanges', false);

      }
    } else {
      const response = await createClub({...club.value});
      if (response) {
          showSuccessAlertCreate.value = true
          emit('unsavedChanges', false);
          loading.value = true
          setTimeout(() => {
            navigateTo(`/tournament/clubs/${response.id}`)
          }, 3000)
      }
    }
  } catch (error) {
    loading.value = false
    phoneValidationError1.value = error.message
    console.error('Error saving venue:', error);
  }
}

const some = ref(true)

watch(() => club.value.phoneNumber1, debounce((newValue) => {
  validatePhoneNumber();
}, 500));

watch(() => club.value.phoneNumber2, debounce((newValue) => {
  validatePhoneNumber();
}, 500));

watch(() => club.value, (newVal, oldVal) => {

  if (oldVal.id === undefined && newVal.id === props.clubId && props.clubId) {
    return;
  }

  if (oldVal && newVal) {
    emit('unsavedChanges', true);
    return;
  }

  if (oldVal.id && newVal.id === props.clubId) {
    emit('unsavedChanges', true);
    return;
  }

  if (newVal) {
    emit('unsavedChanges', true);
  }

}, { deep: true });


onMounted(() => {
  if (props.clubId) {
    fetchClub(props.clubId);
    some.value = true
  }
});
</script>
