<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <p class="font-bold mb-4">
        {{props.venueName}}
      </p>

      <div class="mb-4">
        <TextInput
          label="Club License"
          v-model:value="clubLicense"
          placeholder="Enter Club License"
          type="number"
          class="w-full mb-1"
          @focus-out="fetchClubByLicense"
          :required="true"
          :min="30000000"
        />
        <span class="text-sm text-red-600">
          {{ clubLicenseError }}
        </span>
        <span class="text-sm text-green-600">
          {{ clubLicenseSuccessMessage }}
        </span>
        <span class="text-sm text-red-600">
          {{ props.errorMessage1 }}
        </span>
      </div>

      <div class="mb-6">
        Remember that the license must match an already existing association in
        Sportsys.
      </div>

      <div class="flex justify-center">
        <BaseButton
          type="button"
          class="bg-red-600 text-white mr-2"
          @click="cancelAction"
          >Cancel</BaseButton
        >
        <BaseButton
          type="button"
          @click="confirmAction"
          :disabled="isLoadingFetchByLicense"
          >Confirm</BaseButton
        >
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import TextInput from '~/components/inputs/TextInput.vue';
import type Clubs from '~/interfaces/clubs/club';
import { useClubsFetch } from '~/composables/useClubsFetch/useClubsFetch';

const { fetchClubByCondition } = useClubsFetch()

const props = defineProps({
  venueName: String,
  visible: Boolean,
  id: Number,
  message: String,
  showErrorAlert: Boolean,
  errorMessage: String,
  errorMessage1: String,
});


const emit = defineEmits(['update:visible', 'confirm', 'refreshData']);

const modal = ref(false);
const clubLicense = ref('');
const club = ref()
const errorEmpty = ref(false);

watch(() => props.visible, () => {
  clubLicense.value = "";
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

const searchedClub = ref({} as Clubs)
const clubLicenseError = ref('')
const clubLicenseSuccessMessage = ref('')
const isLoadingFetchByLicense = ref(false);


async function fetchClubByLicense() {
  isLoadingFetchByLicense.value = true
  clubLicenseError.value = '';

 try {
    if (!clubLicense.value) {
      searchedClub.value = {} as Clubs;
    } else if (+clubLicense.value < 60000000 || +clubLicense.value > 70000000) {
      clubLicenseError.value = 'Invalid license!';
    } else {
      const res = await fetchClubByCondition({
        license: clubLicense.value
      }) as { count: Number, rows: Array<Clubs> };

      if (res.count) {
        club.value = res.rows[0] as Clubs;

        const existingVenueRelation = club.value.clubVenues?.some(venue => {

        return venue.venueId === props.id});

        if (existingVenueRelation) {
          clubLicenseError.value = 'Club license has already been added.';
        } else {
          searchedClub.value = club;
          clubLicenseSuccessMessage.value = "The club's license is valid."
        }
      } else {
        clubLicenseError.value = 'Invalid license!';
        searchedClub.value = {} as Clubs;
      }
    }
  } finally {
    isLoadingFetchByLicense.value = false;
  }
}

function confirmAction() {
  if (isLoadingFetchByLicense.value) {
    return;
  }
  if(!clubLicenseError.value) {
    if (clubLicense.value) {
    emit('confirm', clubLicense.value, club.value );
  clubLicenseSuccessMessage.value = ""

    } else {
    clubLicenseError.value = ""

    }
  }
}

function cancelAction() {
  clubLicense.value = "";
  clubLicenseError.value = ""
  clubLicenseSuccessMessage.value = ""
  // localErrorMessage.value = ""
  modal.value = false;
  emit('update:visible', false);
}
</script>
