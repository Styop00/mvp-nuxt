<template>
  <div class="md:p-6">
    <p
      class="text-base font-bold pb-4 flex items-center justify-start tracking-widest mb-8"
    >
      <span
        class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3 "
      />
      {{ tournamentGroupName }} - Registration
    </p>
    <form @submit.prevent="saveRegistration" class="space-y-6">
      <div class="flex flex-col w-full">
        <div class="flex pb-4">
          <div class="flex-1 text-start">Club</div>
          <div class="flex-1 text-start">Levels</div>
          <div class="flex-1 text-start">Teams</div>
        </div>

        <div>
          <div v-for="(row, index) in tableData" :key="index" class="flex">
            <div class="flex-1 text-start">
              {{ row.club }}
            </div>

            <div class="flex-1 text-start">
              {{ row.level }}
            </div>

            <div class="flex-1 text-start flex flex-col pb-4">
              <input
                type="number"
                v-model.number="row.teams"
                placeholder="Enter number"
                class="w-full border border-dark-border-default rounded px-2 py-1"
              />
              <p v-if="row.error" class="text-red-700 text-xs mt-2">
                {{ row.error }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button
          type="button"
          @click="toggleAccordion"
          class="w-full border lg:w-2/3 xl:w-1/2 flex justify-between items-center px-4 py-2 text-left text-brand-primary-color bg-gray-100 rounded-t-md "
        >
          <span class="text-lg font-medium">Already registered clubs</span>
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'transform rotate-180': isAccordionOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          v-if="isAccordionOpen"
          class=" p-4 border-b border-l border-r  w-full lg:w-2/3 xl:w-1/2 rounded-b-md bg-dark-surface-default"
        >
          <div
            v-if="clubNames && clubNames.length > 0"
            v-html="clubNames"
          ></div>
          <div v-else class="text-dark-text-secondary">No clubs registered.</div>
        </div>
      </div>

      <div class="flex justify-start">
        <BaseButton
          class="text-white font-bold py-2 px-4 rounded"
          :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
    </form>
    <SuccessAlert
      v-model:visible="showSuccessAlertCreate"
      text="Registration processed successfully."
    />
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import {useRegistrationFetch} from "~/composables/useRegistrationFetch/useRegistrationFetch";
import {useTournamentGroupFetch} from '~/composables/useTournamentGroupFetch/useTournamentGroupFetch';
import SuccessAlert from '../alerts/SuccessAlert.vue';

const tableData = ref<{
  club: string;
  level: string;
  teams: number | null,
  error: string,
  successMessage: string
}[]>([]);

const props = defineProps({
  tournamentGroupId: Number,
  tournamentGroupLevel: Number,
  clubName: String,
  clubId: Number
});

const isAccordionOpen = ref(false);
const showSuccessAlertCreate = ref(false)
const tournamentGroupName = ref("")
const loading = ref(false)

function toggleAccordion() {
  isAccordionOpen.value = !isAccordionOpen.value;
}

const {fetchRegistrationsByTournamentGroupId, createOrEditBulkRegistration, clubNames} = useRegistrationFetch();

const {fetchTournamentGroupById} = useTournamentGroupFetch();

async function fetchRegistration(id: number) {
  try {
    const response = await fetchRegistrationsByTournamentGroupId(props.tournamentGroupId as number);
    const responseTournament = await fetchTournamentGroupById(props.tournamentGroupId as number);
    tournamentGroupName.value = responseTournament.name
    if (response && response.rows) {
      const selectedClubRegistrations = response.rows.filter(item => item.clubId == props.clubId);

      const levels = responseTournament?.levels || 0;

      if (levels) {
        for (let i = 1; i <= levels; i++) {
          const matchingRegistration = selectedClubRegistrations.find(reg => reg.level === i);

          tableData.value.push({
            club: props.clubName as string,
            level: `Pool ${i}`,
            teams: matchingRegistration ? matchingRegistration.count : null,
            error: "",
            successMessage: ""
          });
        }
      } else {
        tableData.value.push({
          club: props.clubName as string,
          level: "",
          teams: selectedClubRegistrations[0]?.count ? selectedClubRegistrations[0]?.count : null,
          error: "",
          successMessage: ""
        })
      }
    } else {
      console.error("No registration data found.");
    }
  } catch (error) {
    console.error("Error fetching registration data:", error);
  }
}

async function saveRegistration() {
  loading.value = true
  try {
    let hasError = false;

    tableData.value.forEach(row => {
      if (row.teams < 0) {
        row.error = "Team count cannot be less than 0";
        hasError = true;
      } else {
        row.error = "";
      }
    });

    if (hasError) return;
    const registrationData = tableData.value.map(row => ({
      clubId: props.clubId,
      tournamentGroupId: props.tournamentGroupId,
      level: row.level ? parseInt(row.level.replace('Pool ', '')) : null,
      count: row.teams === 0 ? 0 : row.teams || null
    }));

    const response = await createOrEditBulkRegistration(registrationData);

    if (!response || response.length === 0) {
      loading.value = false
      return;
    }
    let hasSuccess = false;
    const responses = Array.isArray(response) ? response : [response];

    responses.forEach(item => {
      if (!item.level) {
        if (item.success) {
          hasSuccess = true;
          showSuccessAlertCreate.value = true;
          loading.value = false
          return
        } else {
          loading.value = false
          tableData.value[0].error = getErrorMessage(item.message);
        }
      } else {
        const matchingRow = tableData.value.find(row => row.level === `Pool ${item.level}`);

        if (matchingRow) {
          if (item.success) {
            hasSuccess = true;
            showSuccessAlertCreate.value = true;
            loading.value = false
            return
          } else {
            loading.value = false
            matchingRow.error = getErrorMessage(item.message);
          }
        }
      }
    });
    loading.value = false

  } catch (error) {
    loading.value = false
    console.error('Error saving registration:', error);
  }
}

function getErrorMessage(message: string) {
  switch (message) {
    case 'No registration created because count is 0 or null':
      return '';
    case 'Registration already exist.':
      return '';
    default:
      return '';
  }
}

onMounted(() => {
  if (props.tournamentGroupId) {
    fetchRegistration(props.tournamentGroupId);
  }
});
</script>
