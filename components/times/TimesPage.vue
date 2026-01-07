<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :loading="loading"
            :headers="headers"
            :clickable="false"
            :data="timeSlotsData"
            title="Times"
            class="bg-white min-h-96 flex flex-col justify-between"
            :show-edit="true"
            :show-delete="true"
            @sorted="sort"
            @edit-icon-clicked="(rowId) => showEditTimeSlot(rowId)"
            @delete-icon-clicked="(rowId) => showDeleteConfirmation(rowId)"
            :show-actions="true"
            :fixed-table="false"
            action-column-classes="w-44"
        >
          <template #header>
            <div class="flex gap-4 w-full items-center justify-end ml-10">
                <BaseButton
                    class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                    @onClick="() => showEditTimeSlotModal = true"
                >
                  Add Time
                </BaseButton>
            </div>
          </template>
          <template #headerBottom v-if="userStore.isAdmin">
            <div class="flex gap-4 w-full items-center justify-between ml-4">
                <div class="flex items-center gap-4">
                  <span class="text-nowrap text-sm font-bold">Filter by</span>
                  <div class="flex gap-4 items-center">
                    <FilterSelect :options="venues" v-model:value="selectedVenue" class="xl:min-w-52 min-w-44"/>
                  </div>
                  <div class="flex gap-4 items-center">
                    <FilterSelect :options="courts" v-model:value="selectedCourt" class="xl:min-w-52 min-w-44"/>
                  </div>
                  <div class="relative">
                    <TextInput
                        :value="range.join(' - ')"
                        placeholder="Date"
                        @click.prevent="() => showCalendar()"
                        :prevent-input="true"
                        :required="true"
                        class="min-w-52"
                    />
                    <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow"
                         @click.stop
                         v-if="showRangeCalendar">
                      <BaseButton
                          class="!py-1 !px-1 mx-auto mt-2 text-xs sm:text-base sm:!px-8 block"
                          @click="() => {range = []; showRangeCalendar = false}"
                      >
                        Clear Date Filter
                      </BaseButton>
                      <RangePicker
                          @close="showRangeCalendar = false"
                          v-model:model-value="range"
                          color="blue"
                      />
                    </div>
                  </div>
                </div>
                <SearchInput
                    v-model="searchQuery"
                    placeholder="Search by reservation text"
                    class="xl:min-w-48 ml-4 min-w-44"
                />
            </div>
          </template>
          <template #actions="{ row }">
            <span class="relative group text-nowrap">
              <font-awesome :icon="['fas', 'calendar-days']"
                            @click="() => navigateTo(`times/${row.id}/reservations`)"
                            class="p-1.5 text-base rounded-full hover:text-lime-400 transition text-lime-500 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Reservations
              </span>
            </span>
          </template>
          <template #footer>
            <div class="flex justify-between ml-4 items-center gap-6">
              <div>
                <p
                    class="text-xs text-nowrap tracking-wider text-gray-400 font-bold"
                >
                  {{ currentShowCount }}
                </p>
              </div>
              <div
                  class="flex justify-start m-2 lg:justify-end items-center gap-6"
              >
                <p class="flex items-center text-nowrap gap-4">
                  Rows per page:
                  <Select
                      :options="limitOptions"
                      v-model:value="limit"
                      direction="top"
                      size="small"
                  />
                </p>
                <template v-if="count > (limit.value ?? 0)">
                  <div class="my-2 mr-2">
                    <TablePagination
                        v-model:page="page"
                        :page-count="pagesCount"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteTimeSlot
        v-model:time-slot-id="timeSlotIdForDelete"
        v-model:visible="showConfirmModal"
        @deleted="emitFetchTimeSlots"
    />
    <CreateOrUpdateTimeSlot
        v-model:visible="showEditTimeSlotModal"
        v-model:time-slot-id="timeSlotIdForUpdate"
        @re-fetch="emitFetchTimeSlots"
    />
  </div>
</template>
<script setup lang="ts">
import Select from "~/components/inputs/Select.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import TableStriped from "~/components/tables/TableStriped.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import type TimeSlot from "~/interfaces/timeSlots/timeSlot";
import type TimeSlotsTable from "~/interfaces/timeSlots/timeSlotsTable";
import moment from "moment";
import DeleteTimeSlot from "~/components/modals/timeSlots/DeleteTimeSlot.vue";
import CreateOrUpdateTimeSlot from "~/components/modals/timeSlots/CreateOrUpdateTimeSlot.vue";
import {useUserStore} from "~/store/user";
import RangePicker from "~/components/datePicker/RangePicker.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import {useCourtsFetch} from "~/composables/useCourtsFetch/useCourtsFetch";
import SearchInput from "~/components/inputs/SearchInput.vue";
import {useVenuesFetch} from "~/composables/useVenuesFetch/useVenuesFetch";
import type Courts from "~/interfaces/courts/courts";
import FilterSelect from "~/components/inputs/FilterSelect.vue";

const orderBy = ref('date')
const orderDirection = ref('asc')
const page = ref(1)
const searchQuery = ref('')
const timeSlotsData = ref([] as Array<TimeSlotsTable>)
const timeSlotIdForDelete = ref(0)
const timeSlotIdForUpdate = ref(0)
const showConfirmModal = ref(false)
const showEditTimeSlotModal = ref(false)
const range = ref([])
const courts = ref([] as Array<SelectOptions>)
const allCourts = ref([] as Array<Courts>)
const venues = ref([] as Array<SelectOptions>)
const selectedCourt = ref({} as SelectOptions)
const selectedVenue = ref({} as SelectOptions)
const showRangeCalendar = ref(false)

const userStore = useUserStore()
const {fetchAllCourts} = useCourtsFetch()
const {fetchAllVenues} = useVenuesFetch()

const props = defineProps({
  loading: {
    type: Boolean,
  },
  timeSlots: {
    type: Array<TimeSlot>,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
})

const emit = defineEmits(['fetchTimeSlots'])

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

const headers = [
  {
    label: 'Court',
    sortable: true,
    sortValue: 'court',
    dataKey: 'court',
    className: 'w-64'
  },
  {
    label: 'Day',
    sortable: false,
    sortValue: '',
    dataKey: 'day',
    className: 'w-20',
  },
  {
    label: 'Date',
    sortable: true,
    sortValue: 'date',
    dataKey: 'date',
    className: 'w-64',
  },
  {
    label: 'Expires On',
    sortable: true,
    sortValue: 'expiration',
    dataKey: 'expiration',
    className: 'w-40'
  },
  ...(userStore.isAdmin ? [{
    label: 'Status',
    sortable: false,
    sortValue: '',
    dataKey: 'status',
    className: 'w-36',
  }] : [{
    label: 'Club',
    sortable: true,
    sortValue: 'club',
    dataKey: 'club',
  }]),
  {
    label: 'Reservations',
    sortable: false,
    dataKey: 'reservations',
    sortValue: '',
    className: 'min-w-80'
  },
]

watch(page, () => {
  emitFetchTimeSlots()
})

watch([searchQuery, limit, range, selectedCourt], () => {
  if (page.value === 1) {
    emitFetchTimeSlots()
  } else {
    page.value = 1
  }
})

const pagesCount = computed(() => {
  return Math.ceil((props.count as number) / (limit.value.value as number))
})

const currentShowCount = computed(() => {
  if (props.count === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * +(limit.value.value ?? 0)
  let currentPageMinValue = (+page.value - 1) * +(limit.value.value ?? 0) + 1
  return currentPageMinValue + ' - ' + ((props.count > currentPageMaxValue) ? currentPageMaxValue : props.count) + ' of ' + props.count
})

watch(() => props.timeSlots, () => {
  timeSlotIdForDelete.value = 0
  timeSlotsData.value = []

  timeSlotsData.value = props.timeSlots.map(timeSlot => {
    let reservationText = ''

    timeSlot.reservations.forEach(reservation => {
      if (reservation.typeId === 3) {
        reservationText += `<p class="text-wrap">${moment(reservation.startTime, 'HH:mm').format('HH:mm')}-${moment(reservation.endTime, 'HH:mm').format('HH:mm')} GP / Mini </p>`
      } else {
        reservationText += `<p class="text-wrap">${moment(reservation.startTime, 'HH:mm').format('HH:mm')}-${moment(reservation.endTime, 'HH:mm').format('HH:mm')} ${reservation.text} </p>`
      }
    })
    return {
      id: timeSlot.id,
      court: timeSlot.court.venue.name + ' ' + timeSlot.court.name,
      day: moment(timeSlot.date.toString()).format('ddd'),
      expiration: timeSlot.expiration,
      date: timeSlot.date + ' ' +
          moment(timeSlot.startTime.toString(), 'HH:mm').format('HH:mm') +
          '-' + moment(timeSlot.endTime.toString(), 'HH:mm').format('HH:mm'),
      ...(userStore.isAdmin ? {
        status: timeSlot.reservations.length ?
            '<span class="bg-yellow-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Partly available</span>'
            :
            '<span class="bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Available</span>'
      } : {
        club: timeSlot.club.shortName
      }),
      reservations: reservationText
    } as TimeSlotsTable
  })
})

watch([selectedVenue], () => {
  if (selectedVenue.value.value) {
    selectedCourt.value = courts.value[0]
    const courtOptions = allCourts.value.filter(court => {
      return court.venueId === selectedVenue.value.value
    })
    courts.value = courtOptions.map(court => {
      return {
        label: `${court.venue?.name} ${court.name}`,
        value: court.id,
        disabled: false
      }
    })
    courts.value.unshift({
      label: '--- All Courts ---',
      value: null,
      disabled: false
    } as SelectOptions)
  } else if (allCourts.value.length && courts.value.length !== (allCourts.value.length + 1)) {
    courts.value = allCourts.value.map(court => {
      return {
        label: `${court.venue?.name} ${court.name}`,
        value: court.id,
        disabled: false
      }
    })
    courts.value.unshift({
      label: '--- All Courts ---',
      value: null,
      disabled: false
    } as SelectOptions)
    selectedCourt.value = courts.value[0]

  }
  if (page.value === 1) {
    emitFetchTimeSlots()
  } else {
    page.value = 1
  }
})

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  emitFetchTimeSlots()
}

function showDeleteConfirmation(id: number) {
  timeSlotIdForDelete.value = id;
  showConfirmModal.value = true;
}

function showEditTimeSlot(id: number) {
  timeSlotIdForUpdate.value = id;
  showEditTimeSlotModal.value = true;
}

function emitFetchTimeSlots() {
  emit('fetchTimeSlots', {
    orderBy: orderBy.value,
    orderDirection: orderDirection.value,
    page: +page.value,
    limit: +(limit.value.value ?? 10),
    searchTerm: searchQuery.value,
    ...(range.value.length ? {
      period: range.value,
    } : {}),
    ...(selectedCourt.value.value ? {
      courtId: selectedCourt.value.value
    } : {}),
    ...(selectedVenue.value.value ? {
      venueId: selectedVenue.value.value
    } : {}),
  })
}

function showCalendar() {
  setTimeout(() => showRangeCalendar.value = true)
}

async function fetchCourts() {
  if (!userStore.seasonSportId) return

  const res = await fetchAllCourts(userStore.seasonSportId)

  allCourts.value = res
  courts.value.push({
    label: '--- All Courts ---',
    value: null,
    disabled: false
  } as SelectOptions)

  res.map(court => {
    courts.value.push({
      label: `${court.venue?.name} ${court.name}`,
      value: court.id,
      disabled: false
    } as SelectOptions)
  })

  selectedCourt.value = courts.value[0]
}

async function fetchVenues() {
  if (!userStore.seasonSportId) return

  const res = await fetchAllVenues({seasonSportId: userStore.seasonSportId})

  venues.value.push({
    label: '--- All Venues ---',
    value: null,
    disabled: false
  } as SelectOptions)

  res.map(venue => {
    venues.value.push({
      label: venue?.name,
      value: venue.id,
      disabled: false
    } as SelectOptions)
  })

  selectedVenue.value = venues.value[0]
}

onMounted(() => {
  document.body.addEventListener('click', () => showRangeCalendar.value = false)
  fetchCourts()
  if (userStore.isAdmin) {
    fetchVenues()
  }
})
</script>
