<template>
  <div class="md:p-6">
    <form @submit.prevent.stop class="space-y-6">
      <TextInput
        label="Venue Name"
        v-model:value="venue.value.name"
        placeholder="Enter Venue name"
        type="text"
        class="w-full md:w-2/3"
        required
      />

      <div class="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
        <TextInput
          label="Address Line 1"
          v-model:value="venue.value.addressLine1"
          placeholder="Address Line 1"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !venue.value.addressLine1) ? '!border-red-500' : ''"
        />
        <TextInput
          label="Address Line 2"
          v-model:value="venue.value.addressLine2"
          placeholder="Address Line 2"
          type="text"
          class="w-full"
        />
      </div>

      <div class="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
        <div class="flex flex-col w-full">
          <TextInput
            label="Postal Code"
            v-model:value="venue.value.postalCode"
            placeholder="Postal Code"
            type="text"
            class="w-full"
            :input-classes="(showRedBorders && !venue.value.postalCode) ? '!border-red-500' : ''"
          />
          <p v-if="postalCodeValidationError" class="text-red-700 text-xs mt-2">
            {{ postalCodeValidationError }}
          </p>
        </div>
        <TextInput
          label="Postal City"
          v-model:value="venue.value.postalCity"
          placeholder="Postal City"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !venue.value.postalCity) ? '!border-red-500' : ''"
        />
      </div>

      <div class="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
        <TextInput
          label="Country"
          v-model:value="venue.value.country"
          placeholder="Country"
          type="text"
          class="w-full"
          :input-classes="(showRedBorders && !venue.value.country) ? '!border-red-500' : ''"
        />
        <div class="flex flex-col w-full">
          <TextInput
            label="Phone Number"
            v-model:value="venue.value.phoneNumber"
            placeholder="Phone Number"
            type="tel"
            class="w-full"
          />
          <p v-if="phoneValidationError" class="text-red-700 text-xs mt-2">
            {{ phoneValidationError }}
          </p>
        </div>
      </div>

      <TextInput
        label="Web Address"
        v-model:value="venue.value.webAddress"
        placeholder="Web Address"
        type="url"
        class="w-full md:w-2/3"
      />

      <div class="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
        <TextInput
          label="Latitude & Longitude"
          v-model:value="venue.latLng"
          placeholder="Latitude & Longitude"
          type="text"
          class="w-full"
        />
        <TextInput
          label="Place ID"
          v-model:value="venue.placeId"
          placeholder="Place ID"
          type="text"
          class="w-full"
        />
      </div>

      <TextInput
        label="Calendar Key"
        v-model:value="venue.value.calKey"
        placeholder="Calendar Key"
        type="text"
        class="w-full md:w-2/3"
      />

      <div
        v-if="venueId"
        class="flex flex-col md:flex-row gap-4 w-full md:w-2/3"
      >
        <CheckBox
          v-model:value="venue.value.inActive"
          label="Active"
          name="Active"
        />
      </div>

      <p v-if="addressValidationError" class="text-red-700 text-xs">
        {{ addressValidationError }}
      </p>

      <div class="flex gap-14 flex-wrap xl:flex-nowrap">
        <template v-if="venue.value?.id">
          <ClubVenue
            v-model:venue="venue.value"
            v-model:clubs="venue.value.clubVenues"
            ref="clubVenueRef"
          />
          <CourtVenue
            v-model:venue="venue.value"
            v-model:courts="venue.value.courts"
            ref="courtVenueRef"
          />
        </template>
      </div>

      <div class="flex justify-start mt-4">
        <BaseButton
          @on-click="saveVenue"
          type="button"
          class="text-white font-bold py-2 px-4 rounded"
          :class="loadingbutton ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
    </form>
    <SuccessAlert
      v-model:visible="showSuccessAlertCreate"
      text="The new Venue has been successfully created."
    />
    <SuccessAlert
      v-model:visible="showSuccessAlertUpdate"
      text="Venue has been successfully updated."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import CheckBox from '~/components/inputs/CheckBox.vue';
import type Venues from '~/interfaces/venues/venues';
import { useVenuesFetch } from '~/composables/useVenuesFetch/useVenuesFetch';
import { debounce } from '~/utils/debounce';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import CourtVenue from '../courts/CourtVenue.vue';
import ClubVenue from '../clubs/ClubVenue.vue';

const showSuccessAlertCreate = ref(false)
const showSuccessAlertUpdate = ref(false)


const initialVenue = reactive({value: {} as Venues})


const courtVenueRef = ref<InstanceType<typeof CourtVenue> | null>(null)
const clubVenueRef = ref<InstanceType<typeof ClubVenue> | null>(null)

const loadingbutton = ref(false)

const props = defineProps({
  venueId: Number,
});

const emit = defineEmits(['venueSaved', 'unsavedChanges']);

const { updateVenue, createVenue, loading } = useVenuesFetch();

const venue = reactive({value: {} as Venues});

const addressValidationError = ref('');

function validateAddressFields() {
  const { addressLine1, postalCode, postalCity, country } = venue.value;

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

const postalCodeValidationError = ref("")

const showRedBorders = computed(() => {
  return !!(venue.value.addressLine1 || venue.value.postalCity || venue.value.country || venue.value.postalCode);
})

const phoneValidationError = ref('');

function validatePhoneNumber() {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const phoneNumber = venue.value.phoneNumber;

  if (!phoneNumber) {
    phoneValidationError.value = '';
    return true;
  }

  if (!phoneRegex.test(phoneNumber)) {
    loadingbutton.value = true
    phoneValidationError.value = 'Please enter a valid phone number in E.164 format (e.g., +123456789012345).';
    return false;
  }

  loadingbutton.value = false
  phoneValidationError.value = '';
  return true;
}

async function fetchVenue(id: number) {
  loading.value = true;
  const response = await useApiV5Fetch(`venues/${id}`);
  if (response.data?.value) {
    initialVenue.value = {...response.data.value}
    initialVenue.value.courts = initialVenue.value.courts.sort((a, b) => a.id - b.id);
    venue.value = JSON.parse(JSON.stringify(initialVenue.value));
    loading.value = false;
  } else {
    console.error('Venue data not found for ID:', id);
  }
}


async function saveVenue() {
  loadingbutton.value = true
  if (!validateAddressFields()) {
    return;
  }

  if(!validatePhoneNumber()) {
    return
  }

  try {
    if (props.venueId) {
      const additionalData: Record<string, any> = {};
        if (clubVenueRef.value?.deletedLicenseNumbers?.length > 0) {
          additionalData.deletedLicenseNumbers = clubVenueRef.value.deletedLicenseNumbers;
        }
        if (clubVenueRef.value?.clubLicenseNumbers?.length > 0) {
          additionalData.clubLicenseNumbers = clubVenueRef.value?.clubLicenseNumbers;
        }
      if (courtVenueRef.value?.courtsCreate) {
        additionalData.courtsCreate = courtVenueRef.value?.courtsCreate;
      }
      if (courtVenueRef.value?.courtsUpdate ) {
        additionalData.courtsUpdate = courtVenueRef.value?.courtsUpdate.value;
      }
      if (courtVenueRef.value?.deleteCourts ) {
        additionalData.deleteCourts = courtVenueRef.value?.deleteCourts;
      }
      const response = await updateVenue(props.venueId, {...venue.value, ...additionalData});
      if (response) {
        loadingbutton.value = false
        showSuccessAlertUpdate.value = true
        if (clubVenueRef) {
          clubVenueRef.value.deletedLicenseNumbers = []
          clubVenueRef.value.clubLicenseNumbers = []
        }

        if (courtVenueRef.value) {
          courtVenueRef.value.courtsCreate = {};
          courtVenueRef.value.courtsUpdate = {};
          courtVenueRef.value.deleteCourts = {};
        }

        emit('unsavedChanges', false);
        refreshData()
      }
    } else {
      const response = await createVenue({...venue.value});
      if (response) {
          loadingbutton.value = true
          showSuccessAlertCreate.value = true
          emit('unsavedChanges', false);
          setTimeout(() => {
            navigateTo(`/tournament/venues/${response.id}`)
          }, 3000)
      }
    }
  } catch (error) {
    loadingbutton.value = false
    phoneValidationError.value = error.message
    console.error('Error saving venue:', error);
  }
}

async function refreshData() {
  if (props.venueId) {

    await fetchVenue(props.venueId);
  }
}
watch(() => venue.value.phoneNumber, debounce((newValue) => {
  validatePhoneNumber();
}, 500));


watch(() => venue.value.courts, (newVal, oldVal) => {
}, { deep: true, immediate: true })
watch(() => venue.value, (newVal, oldVal) => {
  if (oldVal?.id === undefined && newVal.id === props.venueId && props.venueId) {
    return;
  }

  if(JSON.stringify(initialVenue.value) !== JSON.stringify(newVal)) {
    emit('unsavedChanges', true);
  }

}, { deep: true, immediate: true });

onMounted(() => {
  if (props.venueId) {
    fetchVenue(props.venueId);
  }
});
</script>
