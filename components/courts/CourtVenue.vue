<template>
  <div
    class="flex flex-col w-full h-fit xl:w-1/2 pt-4 border-t  border-dark-border-default"
  >
    <div class="flex pb-4 border-b border-dark-border-default text-[18px] font-bold">
      <div class="flex-[1] text-start ">Court</div>
      <div class="flex-[2] text-start text-nowrap">Battle types</div>
      <div
        class="flex-[0.5] text-end cursor-pointer"
        @click="openCourtCreateOrUpdateModal(null)"
      >
        <font-awesome :icon="['fas', 'plus']" class="text-xl" />
      </div>
    </div>

    <div v-if="pseudoCourtTableData.value && pseudoCourtTableData.value.length">
      <div
        v-for="(court, index) in pseudoCourtTableData.value"
        :key="index"
        class="flex py-2 border-b border-dark-border-default"
      >
        <div class="flex-[1] text-start">
          <span class="inline-block pr-6 break-all">{{ court.name }}</span>
        </div>
        <div class="flex-[2] text-start">
          <span
            class="inline-block pr-6 text-xs"
            >{{ generateCourtUsageString(court.courtUsages || [])  }}</span
          >
        </div>

        <div class="flex flex-[0.5] items-center gap-2 justify-end ">
          <button type="button" @click="openCourtCreateOrUpdateModal(court)">
            <font-awesome
              :icon="['fas', 'pen']"
              class="p-1.5 text-base rounded-full hover:text-blue-300 transition text-blue-400 cursor-pointer"
            />
          </button>

          <button type="button" @click="isShowConfirmDeleteModalCourt(court)">
            <font-awesome
              :icon="['fas', 'trash-can']"
              class="p-1.5 text-base rounded-full hover:text-red-300 transition text-red-400 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="mt-2 text-center w-full">No courts available</div>
    <AddOrUpdateCourtToVenue
      v-model:visible="isCourtCreateOrUpdateModalOpen"
      :venueId="venue.id"
      :court="selectedCourt.value || undefined"
      :venueName="venue.name"
      @courtUpdate="updateCourt"
      @courtCreate="createCourt"
    />

    <ConfirmationDeleteModalVue
      @confirm="removeCourt"
      v-model:visible="showConfirmModalCourt"
      message="Are you sure you want to delete this Court?"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, type PropType } from 'vue';
import type Venues from '~/interfaces/venues/venues';
import ConfirmationDeleteModalVue from '~/components/modals/venues/ConfirmationDeleteModal.vue';
import AddOrUpdateCourtToVenue from '../modals/venues/AddOrUpdateCourtToVenue.vue';
import type { Courts, CourtUsage } from '~/interfaces/courts/courts';

const showConfirmModalCourt = ref(false)
const pseudoCourtTableData = reactive<{value: Courts[]}>({value: []})

interface CourtDto {
  name: string;
  venue_id: number;
}

interface CourtRequirements {
  court_requirement_1: number;
  court_requirement_2: number;
  court_requirement_3: number;
  court_requirement_4: number;
}

interface CourtCreateEntry {
  create_court_dto: CourtDto;
  court_requirements: CourtRequirements;
}

interface CourtUpdateEntry {
  id: number
  update_court_dto: CourtDto;
  court_requirements: CourtRequirements;
}

const courtsCreate = ref<{ [key: number]: CourtCreateEntry }>({});
const courtsUpdate = reactive<{value: { [key: number]: CourtUpdateEntry }}>({value: {}});
const deleteCourts = ref<{[key: number]: { id: number, venue_id: number} }>({})
const isCourtCreateOrUpdateModalOpen = ref(false)


const props = defineProps({
  venue: {
    type: Object as PropType<Venues>,
    required: true
  },
  courts: {
    type: Array as PropType<Courts[]>,
    required: true,
    default: () => []
  }
});

const selectedCourt = reactive<{value: Partial<Courts> | null}>({value: null});

const emit = defineEmits(['venueSaved', 'unsavedChanges', 'update:courts']);

watch(() => props.courts, () => {
  if (Array.isArray(props.courts)) {
    pseudoCourtTableData.value = JSON.parse(JSON.stringify(props.courts))
  } else {
    pseudoCourtTableData.value = []
  }
}, {
  deep: true,
  immediate: true
})

watch(() => pseudoCourtTableData.value, () => {
  if(JSON.stringify(props.courts) !== JSON.stringify(pseudoCourtTableData.value)) {
    emit('update:courts', pseudoCourtTableData.value)
  }
}, {
  deep: true,
  immediate: true
})


function isShowConfirmDeleteModalCourt (court: Courts | null) {
  if (!court) return;
  
  if (!court.id) {
    const createIndex = Object.keys(courtsCreate.value).find((key) => {
      const courtInCreate = courtsCreate.value[key];
      return courtInCreate.create_court_dto.name === court.name;
    });
    if (createIndex) {
      selectedCourt.value = {
        name: courtsCreate.value[createIndex].create_court_dto.name,
        venue_id: courtsCreate.value[createIndex].create_court_dto.venue_id,
        courtUsages: [
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_1,
            courtRequirementId: 1,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_2,
            courtRequirementId: 2,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_3,
            courtRequirementId: 3,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_4,
            courtRequirementId: 4,
          }
        ]
      };
      showConfirmModalCourt.value = true;
      return;
    }
  }
  selectedCourt.value = court;
  showConfirmModalCourt.value = true;
}

function openCourtCreateOrUpdateModal(court: Courts | null) {
   if (court && !court.id) {
    const createIndex = Object.keys(courtsCreate.value).find((key) => {
      const courtInCreate = courtsCreate.value[key];
      return courtInCreate.create_court_dto.name === court.name;
    });

    if (createIndex) {
      selectedCourt.value = courtsCreate.value[createIndex].create_court_dto;

      const pseudoIndex = pseudoCourtTableData.value.findIndex(
        (item) => item.name === courtsCreate.value[createIndex].create_court_dto.name
      );
      selectedCourt.value = {
        name: courtsCreate.value[createIndex].create_court_dto.name,
        venue_id: courtsCreate.value[createIndex].create_court_dto.venue_id,

        courtUsages: [
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_1,
            courtRequirementId: 1,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_2,
            courtRequirementId: 2,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_3,
            courtRequirementId: 3,
          },
          {
            courtUsageCount: courtsCreate.value[createIndex].court_requirements.court_requirement_4,
            courtRequirementId: 4,
          }
        ]
      };

      if (pseudoIndex !== -1 && selectedCourt.value && selectedCourt.value.name) {
        pseudoCourtTableData.value[pseudoIndex].name = selectedCourt.value.name;
        if (pseudoCourtTableData.value[pseudoIndex].courtUsages && Array.isArray(pseudoCourtTableData.value[pseudoIndex].courtUsages)) {
          pseudoCourtTableData.value[pseudoIndex].courtUsages.forEach((usage: any) => {
            if (usage.courtRequirementId === 1) {
              usage.courtUsageCount = courtsCreate.value[createIndex].court_requirements.court_requirement_1;
            } else if (usage.courtRequirementId === 2) {
              usage.courtUsageCount = courtsCreate.value[createIndex].court_requirements.court_requirement_2;
            } else if (usage.courtRequirementId === 3) {
              usage.courtUsageCount = courtsCreate.value[createIndex].court_requirements.court_requirement_3;
            } else if (usage.courtRequirementId === 4) {
              usage.courtUsageCount = courtsCreate.value[createIndex].court_requirements.court_requirement_4;
            }
          });
        }
      }
      isCourtCreateOrUpdateModalOpen.value = true;

    }
  } else  {
    selectedCourt.value = court as Courts
    isCourtCreateOrUpdateModalOpen.value = true;
  }
}

function generateCourtUsageString(courtUsages: CourtUsage[] | undefined | null): string {
  if (!courtUsages || !Array.isArray(courtUsages) || courtUsages.length === 0) {
    return '';
  }

  const usageMap: { [key: number]: string } = {
    1: 'Liga/Div',
    2: 'Sen ungdom',
    3: 'Øvrige',
    4: 'Mini',
  };

  const usageArray = courtUsages.map((usage) => {
    const name = usageMap[usage.courtRequirementId || 0] || 'Unknown';
    const count = Number(usage.courtUsageCount) || 0;
    return `${name}: ${count}`;
  });

  return usageArray.join(' · ');
}

function createCourt (
  courtName: string,
  courtRequirement1:number,
  courtRequirement2: number,
  courtRequirement3: number,
  courtRequirement4: number
) {
  const newCourt: Partial<Courts> = {
    name: courtName,
    courtUsages: [
      {
        courtRequirementId: 1,
        courtUsageCount: courtRequirement1 ? courtRequirement1 : 0,
      },
      {
        courtRequirementId: 2,
        courtUsageCount: courtRequirement2 ? courtRequirement2 : 0,
      },
      {
        courtRequirementId: 3,
        courtUsageCount: courtRequirement3 ? courtRequirement3 : 0,
      },
      {
        courtRequirementId: 4,
        courtUsageCount: courtRequirement4 ? courtRequirement4 : 0,
      },
    ],
  };
  pseudoCourtTableData.value.push(newCourt as Courts);

  const nextIndex = Object.keys(courtsCreate.value).length;

  courtsCreate.value[nextIndex] = {
    create_court_dto: {
      name: courtName,
      venue_id: props.venue.id,
    },
    court_requirements: {
      court_requirement_1: courtRequirement1 ,
      court_requirement_2: courtRequirement2 ,
      court_requirement_3: courtRequirement3 ,
      court_requirement_4: courtRequirement4 ,
    },
  };
}

function updateCourt(
  id: number | null,
  courtName: string,
  courtRequirement1: number,
  courtRequirement2: number,
  courtRequirement3: number,
  courtRequirement4: number
) {
  if (id) {

    const updateIndex = Object.keys(courtsUpdate.value).find((key: any) => {
      return courtsUpdate.value[key].id === id;
    });
    if (updateIndex !== undefined) {
      courtsUpdate.value[Number(updateIndex)].update_court_dto.name = courtName;
      courtsUpdate.value[Number(updateIndex)].court_requirements = {
        court_requirement_1: courtRequirement1 ,
        court_requirement_2: courtRequirement2,
        court_requirement_3: courtRequirement3,
        court_requirement_4: courtRequirement4,
      }

      const courtToUpdate = pseudoCourtTableData.value.find((item) => item.id === id);
        if (courtToUpdate) {
          courtToUpdate.name = courtName;

          if (courtToUpdate.courtUsages && Array.isArray(courtToUpdate.courtUsages)) {
            courtToUpdate.courtUsages.forEach((usage) => {
              if (usage.courtRequirementId === 1) {
                usage.courtUsageCount = courtRequirement1;
              } else if (usage.courtRequirementId === 2) {
                usage.courtUsageCount = courtRequirement2;
              } else if (usage.courtRequirementId === 3) {
                usage.courtUsageCount = courtRequirement3;
              } else if (usage.courtRequirementId === 4) {
                usage.courtUsageCount = courtRequirement4;
              }
            });
          }
        }
    } else {
      const nextIndex = Object.keys(courtsUpdate.value).length;
        courtsUpdate.value[nextIndex] = {
          id: id,
          update_court_dto: {
            name: courtName,
            venue_id: props.venue.id,
          },
          court_requirements: {
            court_requirement_1: courtRequirement1 ,
            court_requirement_2: courtRequirement2 ,
            court_requirement_3: courtRequirement3 ,
            court_requirement_4: courtRequirement4 ,
          },
        }
        const courtToUpdate = pseudoCourtTableData.value.find((item) => item.id === id);

        if (courtToUpdate) {
          courtToUpdate.name = courtName;

          if (courtToUpdate.courtUsages && Array.isArray(courtToUpdate.courtUsages)) {
            courtToUpdate.courtUsages.forEach((usage: any) => {
              if (usage.courtRequirementId === 1) {
                usage.courtUsageCount = courtRequirement1;
              } else if (usage.courtRequirementId === 2) {
                usage.courtUsageCount = courtRequirement2;
              } else if (usage.courtRequirementId === 3) {
                usage.courtUsageCount = courtRequirement3;
              } else if (usage.courtRequirementId === 4) {
                usage.courtUsageCount = courtRequirement4;
              }
            });
          }
        }

      }
    } else if (!id) {
        const createIndex = Object.keys(courtsCreate.value).find((key) => {
          const court = courtsCreate.value[key];
          return (
            court.create_court_dto.name === selectedCourt.value?.name &&
            court.create_court_dto.venue_id === props.venue.id
          );
        });

        if (createIndex && selectedCourt.value) {
          courtsCreate.value[createIndex].create_court_dto.name = courtName;
          courtsCreate.value[createIndex].court_requirements = {
            court_requirement_1: courtRequirement1,
            court_requirement_2: courtRequirement2,
            court_requirement_3: courtRequirement3,
            court_requirement_4: courtRequirement4,
          };

          const pseudoIndex = pseudoCourtTableData.value.findIndex(
            (item) => {
              return item.name === selectedCourt.value?.name;
            }
          );

          if (pseudoIndex !== -1 && pseudoIndex !== undefined) {
            pseudoCourtTableData.value[pseudoIndex].name = courtName;
            if (pseudoCourtTableData.value[pseudoIndex].courtUsages && Array.isArray(pseudoCourtTableData.value[pseudoIndex].courtUsages)) {
              pseudoCourtTableData.value[pseudoIndex].courtUsages.forEach((usage: any) => {
                if (usage.courtRequirementId === 1) {
                  usage.courtUsageCount = courtRequirement1;
                } else if (usage.courtRequirementId === 2) {
                  usage.courtUsageCount = courtRequirement2;
                } else if (usage.courtRequirementId === 3) {
                  usage.courtUsageCount = courtRequirement3;
                } else if (usage.courtRequirementId === 4) {
                  usage.courtUsageCount = courtRequirement4;
                }
              });
            }
          }
        }
      }
}

function removeCourt() {
  if (!selectedCourt.value) return;

  if (selectedCourt.value.id) {
    const courtIndex = pseudoCourtTableData.value.findIndex(
      (court) => court.id === selectedCourt.value?.id
    );
    if (courtIndex !== -1) {
      const nextIndex = Object.keys(deleteCourts.value).length;

      deleteCourts.value[nextIndex] = {
        id: selectedCourt.value.id,
        venue_id: selectedCourt.value.venue_id || (selectedCourt.value as any).venueId || props.venue.id,
      };

      pseudoCourtTableData.value.splice(courtIndex, 1);
    }

    showConfirmModalCourt.value = false;
  } else {
    const createIndex = Object.keys(courtsCreate.value).find((key) => {
      const court = courtsCreate.value[key];
      return (
        court.create_court_dto.name === selectedCourt.value?.name &&
        court.create_court_dto.venue_id === props.venue.id
      );
    });

    if (createIndex) {
      delete courtsCreate.value[createIndex];
    }

    const pseudoIndex = pseudoCourtTableData.value.findIndex(
      (item) => {
        return item.name === selectedCourt.value?.name;
      }
    );

    if (pseudoIndex !== -1) {
      pseudoCourtTableData.value.splice(pseudoIndex, 1);
    }
  }
}

defineExpose({
  pseudoCourtTableData,
  courtsCreate,
  courtsUpdate,
  deleteCourts
})
</script>
