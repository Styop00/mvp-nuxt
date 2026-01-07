<template>
  <div class="flex flex-col gap-10">
    <div
      class="p-6 bg-white w-full border-t rounded-2xl grid grid-cols-1 gap-y-2"
    >
      <div class="flex gap-3 items-center">
        <span>Master Data</span>
        <BaseButton
          @on-click="editCoachModalShow"
          type="button"
          class="text-white font-bold py-2 px-4 rounded"
        >
          Right Info
        </BaseButton>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">Name:</span>
        <div class="flex items-center">
          <input
            v-if="isEditingName"
            v-model="editedName"
            type="text"
            class="border border-gray-300 p-2 rounded w-[300px]"
          />
          <span v-else @click="enableEditing" class="cursor-pointer">
            {{ coach.person ? coach.person.name : 'Loading...' }}
          </span>
          <button
            v-if="!isEditingName"
            @click="enableEditing"
            class="ml-2 text-blue-500 hover:underline editIcon"
          >
            <font-awesome
              :icon="['fas', 'pen']"
              class="p-1.5 text-base rounded-full hover:text-blue-300 transition text-blue-400 cursor-pointer"
            />
          </button>
        </div>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">Email:</span>
        <span v-if="coach.person">{{ coach.person.email }}</span>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">License Number:</span>
        <span v-if="coach.license">{{ coach.license }}</span>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">Status:</span>
        <span v-html="status"></span>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">License Period:</span>
        <span>{{ licensePeriod }}</span>
      </div>

      <div class="flex items-center text-sm">
        <span class="font-semibold w-36">M License:</span>
        <span>{{ mlicense }}</span>
      </div>

      <div class="flex items-center text-sm">
        <span class="font-semibold w-36">B License:</span>
        <span>{{ blicense }}</span>
      </div>

      <div class="flex items-center text-sm">
        <span class="font-semibold w-36">T License:</span>
        <span>{{ tlicense }}</span>
      </div>

      <div class="flex items-center">
        <span class="font-semibold w-36">Level:</span>
        <span>{{ coach.level }}</span>
      </div>
    </div>

    <ActiveTeams v-if="coach.person" :coach="coach" />
    <History v-if="coach.person" :coach="coach" />
    <CoachCourses
      v-if="coach.person"
      :coach="coach"
      @refreshData="refreshData"
      :key="courseKey"
    />
  </div>
  <EditCoachInfoModal
    v-model:visible="isShowCreateModal"
    :coachId="props.coachId"
    @refresh-data="refreshData"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useCoachesFetch } from '~/composables/useCoachesFetch/useCoachesFetch';
import type Coach from '~/interfaces/coaches/coach';
import type CoachLicense from '~/interfaces/coaches/coach';
import { usePersonFetch } from "~/composables/usePersonFetch/usePersonFetch"
import ActiveTeams from '../coaches/ActiveTeams.vue';
import History from '../coaches/History.vue';
import CoachCourses from '../coaches/CoachCourses.vue';
import EditCoachInfoModal from '~/components/modals/coach/EditCoachInfoModal.vue'
import BaseButton from '../buttons/BaseButton.vue';

const coach = ref({} as Coach);
const status = ref('');
const licensePeriod = ref('');
const mlicense = ref('');
const blicense = ref('');
const tlicense = ref('');
const courseKey = ref(0);

const props = defineProps({
  coachId: Number,
});

const isEditingName = ref(false);
const editedName = ref('');

const isShowCreateModal = ref(false)

function editCoachModalShow() {
  isShowCreateModal.value = true;
}

const { fetchCoachById } = useCoachesFetch();
const { editPerson } = usePersonFetch();

async function fetchCoach(id: number) {
  const response = await fetchCoachById(id);
  if (response) {
    coach.value = response as Coach;
    status.value =  `<span class="px-2 py-1 rounded-sm text-[9px] font-bold ${
              coach.value.person?.user?.userRoles?.length
                ? "text-brand-green bg-green-100"
                : "text-red-500 bg-red-100"
            }">
              ${coach.value.person?.user?.userRoles?.length ? "Active" : "Inactive"}
            </span>
            ${
              new Date(coach.value.end as string).getTime() <= Date.now()
                ? '<span class="text-red-500 pl- text-[10px]">expired</span>'
                : ""
            }
          `;
    licensePeriod.value = `${coach.value.start} - ${coach.value.end}`;
    mlicense.value = findLatestLicenseByType(coach.value.coachLicenses, 1);
    blicense.value = findLatestLicenseByType(coach.value.coachLicenses, 2);
    tlicense.value = findLatestLicenseByType(coach.value.coachLicenses, 3);
    editedName.value = coach.value.person?.name || '';
    courseKey.value++
  }
}

function findLatestLicenseByType(licenses: Partial<CoachLicense>[], type: number) {
    const filteredLicenses = licenses
    .filter((license) => license.coachLicenseTypeId === type)
    return filteredLicenses.length > 0 ? `${filteredLicenses[0].start} - ${filteredLicenses[0].end}` : 'Inactive';
}

const enableEditing = () => {
  isEditingName.value = true;
  editedName.value = coach.value.person?.name || '';
};

const saveName = async () => {
  if (editedName.value !== coach.value.person.name) {
    coach.value.person.name = editedName.value;
    const response = await editPerson(coach.value.person.id as number, { name: editedName.value });
    if (response) {
      fetchCoach(props.coachId as number);
    }
  }
  isEditingName.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const targetElement = event.target as HTMLElement;

  if (
    isEditingName.value &&
    !targetElement.closest('input') &&
    !targetElement.closest('.editIcon')
  ) {
    saveName();
  }
};

function refreshData() {
  if (props.coachId) {
    fetchCoach(props.coachId);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (props.coachId) {
    fetchCoach(props.coachId);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
