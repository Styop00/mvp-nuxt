<template>
  <div class="p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :headers="headers"
            :clickable="true"
            @rowClicked="openEditModal"
            :data="tableData"
            title="Rows"
            class="bg-dark-surface-default"
        >
          <template #header>
            <div class="flex justify-end items-center gap-6 mr-3">
              <p class="flex items-center text-nowrap gap-4 my-3">
                Rows per page:
                <Select :options="limitOptions" v-model:value="limit"/>
              </p>
              <template v-if="count > limit.value">
                <TablePagination v-model:page="page" :page-count="pagesCount"/>
              </template>
            </div>
          </template>
          <template #footer>
            <template v-if="count > limit.value">
              <TablePagination
                  v-model:page="page"
                  :page-count="pagesCount"
                  class="!justify-end my-3 mr-5"
              />
            </template>
          </template>
        </TableStriped>
      </div>
    </div>
    <UpdateTournament v-model:visible="showModal" :data="selectedTournament" @updated="fetchTournaments"/>
  </div>
</template>

<script setup lang="ts">
import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type TableHeader from "~/interfaces/table/tableHeader";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import type TournamentConfigTableDAta from "~/interfaces/tournament/config/tournamentConfigTableDAta";
import TableStriped from "~/components/tables/TableStriped.vue";
import moment from "moment";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import TablePagination from "~/components/pagination/TablePagination.vue";
import UpdateTournament from "~/components/modals/tournament/UpdateTournament.vue";
import {useUserStore} from "~/store/user";

const orderBy = ref('name')
const orderDirection = ref('ASC')
const headers = ref([] as Array<TableHeader>)
const count = ref(0 as Number)
const fullData = ref([] as Array<TournamentConfigs>)
const tableData = ref([] as Array<TournamentConfigTableDAta>)
const showModal = ref(false)
const selectedTournament = ref({} as TournamentConfigs)

const userStore = useUserStore()

const limit = ref({
  label: '10',
  value: 10,
  disabled: false
} as SelectOptions)

const limitOptions = ref([{
  label: '10',
  value: 10,
  disabled: false
},
  {
    label: '20',
    value: 20,
    disabled: false
  },
  {
    label: '50',
    value: 50,
    disabled: false
  }
] as SelectOptions[])

const page = ref(1 as Number)

onMounted(() => {
  fetchTournaments()

  headers.value = [
    {
      label: 'Name',
      sortable: true,
      sortValue: 'name',
      dataKey: 'name',
    },
    {
      label: 'Group',
      sortable: false,
      sortValue: '',
      dataKey: 'group',
    },
    {
      label: 'Tempting',
      sortable: false,
      sortValue: '',
      dataKey: 'tempting',
    },
    {
      label: 'Judges',
      sortable: false,
      dataKey: 'judges',
      sortValue: '',
    },
    {
      label: 'Course requirements',
      sortable: false,
      dataKey: 'course_requirements',
      sortValue: '',
    },
  ]
})

watch(page, () => {
  fetchTournaments()
})

watch(limit, () => {
  if (page.value === 1) {
    fetchTournaments();
  } else {
    page.value = 1;
  }
})

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number))
})

async function fetchTournaments() {
  fullData.value = []
  tableData.value = []
  const response = await useApiV5Fetch('tournaments',
      {
        query: {
          seasonSportId: userStore.seasonSportId,
          deleted: false,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          page: page.value,
          limit: limit.value.value
        }
      })

  if (!response.data?.value) {
    return
  }
  const result = response.data?.value as { count: Number, rows: Array<TournamentConfigs> }
  count.value = result.count
  fullData.value = result.rows as Array<TournamentConfigs>

  fullData.value.forEach((tournament: TournamentConfigs) => {
    let name = `${tournament.name ? tournament.name : "<em class='text-red-400'>No name</em>"} (${tournament.shortName ? tournament.shortName : "<em class='text-danger'>(mangler fork.)</em>"})`
    let tempting = `<p class="text-sm">
                      <span class="text-blue-500">registration:</span> ${tournament.registrationDeadLine ?? '30-11--0001'}
                      <br>
                      <span class="text-blue-500">tl determine:</span> ${tournament.CMTimeSetUntil ? moment(tournament.CMTimeSetUntil, 'yyyy-mm-DD').format('DD-mm-yyyy') : '-'}
                      <br>
                      <span class="text-blue-500">free transfer:</span> ${tournament.freeRescheduleUntilDate ? moment(tournament.freeRescheduleUntilDate, 'yyyy-mm-DD').format('DD-mm-yyyy') : '-'}
                      <br>
                      <span class="text-blue-500">match settlement:</span> ${tournament.gameDeadLine ? moment(tournament.gameDeadLine, 'yyyy-mm-DD').format('DD-mm-yyyy') : '-'}
                    </p>`
    let judges = `<p class="text-sm">
                      <span class="text-blue-500">Per match:</span> ${tournament.refsPerGame ?? 0}
                      <br>
                      <span class="text-blue-500">From Association:</span> ${tournament.refsFromAssociations ? 'yes' : 'no'}
                      <br>
                      <span class="text-blue-500">Driving:</span> ${tournament.transportationFee ?? '-'}
                    </p>`

    let courtRequirement = 'Not Set'
    if (tournament.courtRequirementId == 1) {
      courtRequirement = "League/Div";
    } else if (tournament.courtRequirementId == 2) {
      courtRequirement = "Late Youth";
    } else if (tournament.courtRequirementId == 3) {
      courtRequirement = "Others";
    } else if (tournament.courtRequirementId == 4) {
      courtRequirement = "Mini";
    }

    let coachLicenseType = "Not Set";
    if (tournament.coachLicenseTypeId == 1) {
      coachLicenseType = "M: MVP / Exercise";
    } else if (tournament.coachLicenseTypeId == 2) {
      coachLicenseType = "B: Children";
    } else if (tournament.coachLicenseTypeId == 3) {
      coachLicenseType = "T: Talent";
    }

    let curseRequirements = `<p class="text-sm">
                              <span class="text-blue-500">pitch:</span> ${courtRequirement}
                              <br>
                              <span class="text-blue-500">coach:</span> ${coachLicenseType}
                              <br>
                              <span class="text-blue-500">earliest start:</span> ${tournament.earliestStart ?? '-'}
                              <br>
                              <span class="text-blue-500">latest start:</span> ${tournament.latestStart ?? '-'}
                            </p>`
    tableData.value.push({
      id: tournament.id,
      name: name,
      group: tournament.tournamentGroupId + '', //todo tournament.tournamentGroup.name
      tempting: tempting,
      judges: judges,
      course_requirements: curseRequirements,
    })
  })
}

function openEditModal(id: number) {
  selectedTournament.value = fullData.value.find(tournament => tournament.id === id) as TournamentConfigs
  showModal.value = true
}
</script>