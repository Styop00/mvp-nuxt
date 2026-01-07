<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4  ">
      <div
        class="flex justify-between items-center mb-3 py-3 border-b !overflow-y-visible"
      >
        <p class="font-bold">Court Assignment</p>
        <font-awesome
          :icon="['fas', 'xmark']"
          @click="() => modal = false"
          class="cursor-pointer"
        />
      </div>

      <template v-if="loading" class="">
        <font-awesome
          :icon="['fas', 'spinner']"
          class="fa-spin w-full text-2xl mb-6 mt-6"
        />
        <p class="w-full text-center">Loading data...</p>
      </template>
      <template v-else>
        <form @submit.prevent="saveChanges" v-if="allCourts.length > 1">
          <div
            class="sm:grid sm:grid-flow-col content-center w-full sm:grid-rows-5 gap-2 !overflow-y-visible"
          >
            <template v-for="i in selectedCourts.length">
              <template v-if="i !== allCourts.length">
                <Select
                  class=" mt-4 w-full overflow-y-visible"
                  :options="allCourtsOptions"
                  :disable-auto-select="true"
                  v-model:value="selectedCourts[i-1]"
                  :direction="i === 5 ? 'top' : 'bottom'"
                />
              </template>
            </template>
          </div>

          <BaseButton class="!py-2 block mt-4 mx-auto"> Save </BaseButton>
        </form>
        <div v-else>
          There are currently no court data assigned to the club.
        </div>
      </template>
    </div>
  </BaseModalComponent>

  <SuccessAlert
    v-model:visible="showSuccessAlertUpdate"
    text="The changes have been successfully applied."
  />
</template>

<script setup lang="ts">
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import type Clubs from '~/interfaces/clubs/club';
import Select from "~/components/inputs/Select.vue"
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import { useClubsFetch } from '~/composables/useClubsFetch/useClubsFetch';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import { useCourtPriorityFetch } from "~/composables/useCourtPriority/useCourtPriority"

const props = defineProps({
  visible: Boolean,
  id: Number
});
const club = ref({} as Clubs)
const loading = ref(false)

const { fetchClubByIdWithCourts } = useClubsFetch()

const emit = defineEmits(['update:visible', 'refreshData']);

const { createCourtPrioritiesBulk } = useCourtPriorityFetch()
const modal = ref(false);

const selectedCourts = ref([] as SelectOptions[]);
const selectedCourtsWithoutModify = ref([] );

const allCourts = ref([] as SelectOptions[]);

watch(() => props.visible, async (newVal) => {
  if (newVal && props.id) {
    modal.value = newVal;
    loading.value = true;

   try {
    const fetchedClub = await fetchClubByIdWithCourts(props.id);
    club.value = fetchedClub;

    selectedCourts.value = [];
    selectedCourtsWithoutModify.value = [];
    allCourts.value = [];

    allCourts.value = club.value.clubVenues.flatMap(venue =>
      venue.venue.courts.map(court => getSelectableOptions(court))
    );

    allCourts.value.unshift({
      label: '---select---',
      value: null,
      disabled: false,
    });

    club.value.clubVenues.flatMap(venue =>
      venue.venue.courts.forEach(court => {
        if (court.courtPriorities.length > 0) {
          selectedCourtsWithoutModify.value.push(court);
        }
      })
    );

    selectedCourts.value = selectedCourtsWithoutModify.value
      .sort((a, b) => a.courtPriorities[0].courtPriorityNumber - b.courtPriorities[0].courtPriorityNumber)
      .map(court => getSelectableOptions(court));

    selectedCourts.value.push({
      label: '---select---',
      value: null,
      disabled: false,
    });
   } finally {
      loading.value = false
   }
  }
});

const showSuccessAlertUpdate = ref(false)

watch(() => selectedCourts.value, () => {
  let courts = selectedCourts.value.filter((court, index) => !!court.value || index === selectedCourts.value.length - 1)
  if (courts.length && !!courts[courts.length - 1].value && courts.length < 10) {
    courts.push({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }

  if (JSON.stringify(courts) !== JSON.stringify(selectedCourts.value)) {
    selectedCourts.value = courts
  }
}, {
  deep: true,
  immediate: true
})

const allCourtsOptions = computed(() => {
  return allCourts.value.filter((court) => {
    return !court.value || (selectedCourts.value.map(court => court.value)).indexOf(court.value) < 0
  })
})


watch(() => modal.value, (newVal) => {
  if (!newVal) {
    // resetModal();
    emit('update:visible', false);
    allCourts.value = []
    selectedCourts.value = []
  }
});

const getSelectableOptions = (court: any) => {
  return { label: court.name, value: court.id, disabled: false };
};

async function saveChanges() {
  const body = selectedCourts.value.map((court) => {
    return {
      clubId: Number(props.id),
      courtId: Number(court.value)
    }
  })
  body.pop()

  await createCourtPrioritiesBulk(body, props.id as number)
  showSuccessAlertUpdate.value = true
  modal.value = false
}
</script>
