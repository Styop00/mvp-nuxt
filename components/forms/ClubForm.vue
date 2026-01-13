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
            v-model:value="club.short_name"
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
          v-model:value="club.postal_city"
          placeholder="City"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.postal_city) ? '!border-red-500' : ''"
        />
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextInput
          label="Address Line 1"
          v-model:value="club.address_line1"
          placeholder="Address Line 1"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.address_line1) ? '!border-red-500' : ''"
        />
        <TextInput
          label="Address Line 2"
          v-model:value="club.address_line2"
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
          v-model:value="club.postal_code"
          placeholder="Postal Code"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !club.postal_code) ? '!border-red-500' : ''"
        />
      </div>
      <div class="flex gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <div class="flex flex-col w-full">
          <TextInput
            label="Phone Number 1"
            v-model:value="club.phone_number1"
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
            v-model:value="club.phone_number2"
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
          v-model:value="club.web_address"
          placeholder="Web address"
          type="text"
          class="w-full"
        />
      </div>
      <div
        v-if="clubId"
        class="flex flex-col xl:flex-row gap-4 w-full md:w-2/3"
      >
        <CheckBox v-model:value="club.is_active" label="Active" name="Active" />
      </div>
      <div class="flex flex-col gap-4 w-full xl:w-2/3 flex-wrap md:flex-nowrap">
        <TextArea
          v-model:value="club.public_notes"
          label="Public info"
          class=""
        />
        <TextArea
          v-model:value="club.internal_notes"
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

const emit = defineEmits(['clubSaved']);


const { updateClub, createClub } = useClubsFetch();

const club = ref<Partial<Clubs>>({});


const addressValidationError = ref('');

function validateAddressFields() {
  const { address_line1, postal_code, postal_city, country } = club.value;
  if (
    (address_line1 || postal_code || postal_city || country) &&
    (!address_line1 || !postal_code || !postal_city || !country)
  ) {
    addressValidationError.value = 'Please fill all address-related fields (Address Line 1, Postal Code, Postal City, Country).';
    return false;
  }

  addressValidationError.value = '';
  return true;
}

const showRedBorders = computed(() => {
  return !!(club.value.address_line1 || club.value.postal_city || club.value.country || club.value.postal_code);
})

const phoneValidationError1 = ref('');
const phoneValidationError2 = ref('');

function validatePhoneNumber() {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  const { phone_number1, phone_number2 } = club.value;

  let isValid = true;

  if (phone_number1 && !phoneRegex.test(phone_number1)) {
    phoneValidationError1.value = 'Please enter a valid phone number in E.164 format (e.g., +123456789012345).';
    isValid = false;
  } else {
    phoneValidationError1.value = '';
  }

  if (phone_number2 && !phoneRegex.test(phone_number2)) {
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

      }
    } else {
      const response = await createClub({...club.value});
      if (response) {
          showSuccessAlertCreate.value = true
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

watch(() => club.value.phone_number1, debounce((newValue) => {
  validatePhoneNumber();
}, 500));

watch(() => club.value.phone_number2, debounce((newValue) => {
  validatePhoneNumber();
}, 500));

// Watch for prop changes (e.g., navigating from club 1 to club 2)
watch(() => props.clubId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    club.value = {} as Clubs
    fetchClub(newId);
  }
}, { immediate: false })

onMounted(() => {
  if (props.clubId) {
    fetchClub(props.clubId);
    some.value = true
  }
});
</script>
