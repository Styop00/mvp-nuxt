<template>
  <div
    class="flex flex-col w-full  h-fit xl:w-1/2 pt-4 border-t  border-gray-300"
  >
    <div class="flex pb-4  text-[18px] border-b border-gray-300 font-bold">
      <div class="flex-[2] text-start ">Club</div>
      <div class="flex-[0.5] text-start">License</div>
      <div
        class="flex-[0.5] text-end cursor-pointer"
        @click="openClubSearchModal"
      >
        <font-awesome :icon="['fas', 'plus']" class="text-xl" />
      </div>
    </div>
    <div v-if="pseudoClubTableData && pseudoClubTableData.length">
      <div
        v-for="(clubVenue, index) in pseudoClubTableData"
        :key="index"
        class="flex py-2 border-b border-gray-300"
      >
        <div class="flex-[2] text-start">
          <span class="inline-block pr-6">{{ clubVenue.club.name }}</span>
        </div>
        <div class="flex-[0.5] text-start">
          {{ clubVenue.club.license }}
        </div>
        <div class="flex-[0.5] text-end ">
          <button
            type="button"
            @click="isShowConfirmDeleteModalClub(clubVenue.club)"
          >
            <font-awesome
              :icon="['fas', 'trash-can']"
              class="p-1.5 text-base rounded-full hover:text-red-300 transition text-red-400 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="mt-2 text-center w-full">No clubs available</div>
  </div>
  <ConfirmationDeleteModal
    v-model:visible="showConfirmModalClub"
    message="Are you sure you want to delete this Club?"
    @confirm="removeClub"
  />

  <AddClubToVenue
    v-model:visible="isClubSearchModalOpen"
    :id="venue.id"
    name="Associate Club"
    :showErrorAlert="showErrorAlert"
    v-model:errorMessage="errorMessage"
    :venueName="venue.name"
    @confirm="associateClub"
    :errorMessage1="errorMessage1"
  />
</template>

<script setup lang="ts">
import type Clubs from '~/interfaces/clubs/club';
import type Venues from '~/interfaces/venues/venues';
import ConfirmationDeleteModal from '../modals/clubs/ConfirmationDeleteModal.vue';
import AddClubToVenue from '../modals/venues/AddClubToVenue.vue';

const showConfirmModalClub = ref(false)
const clubLicense = ref()
const pseudoClubTableData = ref<any[]>([])
const deletedLicenseNumbers = ref<number[]>([])
const clubLicenseNumbers = ref<number[]>([])

const isClubSearchModalOpen = ref(false);
const showErrorAlert = ref(false);
const errorMessage = ref('');
const errorMessage1 = ref('');

const props = defineProps({
  venue: {
    type: Object as PropType<Venues>,
    required: true
  },
  clubs: {
    type: Object as PropType<Clubs>,
    required: true
  }
});

const emit = defineEmits(['update:clubs']);


watch(() => props.clubs, () => {
  pseudoClubTableData.value = JSON.parse(JSON.stringify(props.clubs))
}, {
  deep: true,
  immediate: true
})



watch(() => pseudoClubTableData.value, () => {
  if(JSON.stringify(props.clubs) !== JSON.stringify(pseudoClubTableData.value)) {
    emit('update:clubs', pseudoClubTableData.value)
  }
}, {
  deep: true,
  immediate: true
})


function isShowConfirmDeleteModalClub (club: any) {
  clubLicense.value = club.license
  showConfirmModalClub.value = true
}

function openClubSearchModal() {
  isClubSearchModalOpen.value = true;
}

function removeClub() {

  const clubToDelete = pseudoClubTableData.value.find(
    (item) => item.club.license === clubLicense.value
  );


  if (clubToDelete) {
    deletedLicenseNumbers.value.push(clubLicense.value)
  }

  pseudoClubTableData.value = pseudoClubTableData.value.filter(
    (item) => item.club.license !== clubLicense.value
  );

}

async function associateClub(clubLicense: number, club: {}) {
  const indexss = pseudoClubTableData.value.findIndex(item => {
    return item.club.license === clubLicense})
    errorMessage1.value = ""
    if(indexss === -1) {
      pseudoClubTableData.value.push({
        club: {
          name: club?.name,
          license: club?.license
        }
      })
      clubLicenseNumbers.value.push(clubLicense)
      isClubSearchModalOpen.value = false
    } else {
      errorMessage1.value = "Club license has already been added."
    }
  }

watch(() => isClubSearchModalOpen.value, (newVal) => {
  if (!newVal) {
    errorMessage1.value = "";
  }
});


defineExpose({
  pseudoClubTableData,
  deletedLicenseNumbers,
  clubLicenseNumbers,

})
</script>
