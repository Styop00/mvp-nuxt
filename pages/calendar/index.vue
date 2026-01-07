<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <Breadcrumb/>
        <div class="bg-white min-w-full shadow-lg rounded-2xl overflow-x-auto">
          <div class="flex justify-between items-center px-2 border-b mb-3">
            <p class="text-base font-bold py-4 flex items-center justify-start tracking-widest">
              <span class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"/>
              Calendar
            </p>
          </div>
          <div class="flex gap-4 items-center px-4 mb-4">
            <span class="text-nowrap text-sm font-bold">Filter by</span>
            <Select
                :options="filterOptions"
                v-model:value="filter"
                v-show="filterOptions.length > 1"
                class="!w-40"
            />
            <FilterSelect
                :options="courts"
                v-model:value="selectedCourt"
                v-if="filter.value === 'court'"
                class="min-w-80"/>
            <FilterSelect
                :options="clubUserOptions"
                v-model:value="selectedUserId"
                v-if="filter.value === 'coach'"
                class="min-w-80"
            />
          </div>
          <FullCalendar :options='calendarOptions' class="px-2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import useCalendarFetch from "~/composables/useCalendarFetch/useCalendarFetch";
import Select from "~/components/inputs/Select.vue";
import FilterSelect from "~/components/inputs/FilterSelect.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useCourtsFetch} from "~/composables/useCourtsFetch/useCourtsFetch";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";

const {getAllEvents} = useCalendarFetch()
const {fetchAllCourts} = useCourtsFetch()
const {getAllClubUsers} = useClubsFetch()
const userStore = useUserStore()

const courts = ref([] as Array<SelectOptions>)
const selectedCourt = ref({
  label: '--- select court ---',
  value: null,
  disabled: false
} as SelectOptions)

const selectedUserId = ref({
  label: '--- select user ---',
  value: null,
  disabled: false
} as SelectOptions)

const clubUserOptions = ref([] as Array<SelectOptions>)

const filter = ref({
  label: 'Mine',
  value: 'mine',
  disabled: false,
})

const filterOptions = ref([
  {
    label: 'Mine',
    value: 'mine',
    disabled: false,
  },
  {
    label: 'Court',
    value: 'court',
    disabled: false,
  },
])

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  weekends: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'listYear,dayGridMonth,timeGridWeek,timeGridDay'
  },
  firstDay: 1,
  dayHeaderFormat: { weekday: 'short'},
  views: {
    dayGridMonth: {
      dayHeaderFormat: { weekday: 'long' },
    },
    timeGridWeek: {
      dayHeaderFormat: { weekday: 'short', day: 'numeric' },
    },
    timeGridDay: {
      dayHeaderFormat: { weekday: 'long', day: 'numeric' },
    },
  },
  eventDidMount: (info: any) => {
    // Set the description as a native tooltip
    info.el.setAttribute('title', info.event.title);
  },
  events: []
})

async function fetchCourts() {
  if (!userStore.seasonSportId) return
  const res = await fetchAllCourts(userStore.seasonSportId)

  courts.value.push({
    label: '--- select court ---',
    value: null,
    disabled: false
  } as SelectOptions)

  res.map(court => {
    courts.value.push({
      label: `${court.venue?.name} ${court.name} `,
      value: court.id,
      disabled: false
    } as SelectOptions)
  })
}

const getEvents = async () => {
  const res = await getAllEvents({
    type: filter.value.value,
    courtId: (filter.value.value === 'court' && selectedCourt.value.value) ? selectedCourt.value.value : null,
    coachId: (filter.value.value === 'coach' && selectedUserId.value?.value) ? selectedUserId.value?.value : null,
  })

  calendarOptions.value.events = res.map((event: any) => {
    if (event.gameId) {
      return {
        ...event,
        url: `calendar/${event.gameId}`,
      }
    }
    return {...event}
  })
}

watch(() => selectedCourt.value, () => {
  if (selectedCourt.value.value) {
    selectedUserId.value = {
      label: '--- select user ---',
      value: null,
      disabled: false
    }
    getEvents()
  }
}, {
  deep: true,
  immediate: true
})

watch(() => selectedUserId.value, () => {
  if (selectedUserId.value.value) {
    selectedCourt.value = {
      label: '--- select court ---',
      value: null,
      disabled: false
    }
    getEvents()
  }
}, {
  deep: true,
  immediate: true
})

watch(() => filter.value, () => {
  if (filter.value.value === 'court' && selectedCourt.value.value) {
    selectedUserId.value = {
      label: '--- select user ---',
      value: null,
      disabled: false
    }
    getEvents()
  } else if (filter.value.value === 'coach' && selectedUserId.value.value) {
    selectedCourt.value = {
      label: '--- select court ---',
      value: null,
      disabled: false
    }
    getEvents()
  } else if (filter.value.value === 'mine') {
    selectedUserId.value = {
      label: '--- select user ---',
      value: null,
      disabled: false
    }
    selectedCourt.value = {
      label: '--- select court ---',
      value: null,
      disabled: false
    }
    getEvents()
  }
}, {
  deep: true,
  immediate: true,
})

async function fetchUsers(clubId: number) {
  const res = await getAllClubUsers(clubId)
  clubUserOptions.value = res.map((user) => {
    return {
      label: user.name ? user.name : user.email,
      value: user.id,
      disabled: false,
    }
  })

  clubUserOptions.value.unshift({
    label: '--- select user ---',
    value: null,
    disabled: false
  })
}

fetchCourts()

onMounted(() => {
  const userClub = userStore.user.userRoles
      .find((userRole: any) => userRole.seasonSportId === userStore.seasonSportId && userRole.userRoleApprovedByUserId > 0 && userRole.clubId)
  if (userClub) {
    filterOptions.value.push({
      label: 'Coach',
      value: 'coach',
      disabled: false,
    })

    fetchUsers(userClub.clubId)
  }
})

</script>

<style>
.fc .fc-button-primary {
  background-color: #4A5357;
  border-color: #FFF;
  border-radius: 10px;
}

.fc .fc-button-primary:not(:disabled):active,
.fc .fc-button-primary:not(:disabled).fc-button-active {
  color: #00D9C0;
  background-color: #4A5357;
  border-color: #FFF;
  opacity: 0.9;
}

.fc .fc-button-primary:focus,
.fc .fc-button-primary:not(:disabled).fc-button-active:focus,
.fc .fc-button-primary:not(:disabled):active:focus {
  box-shadow: none !important;
}
</style>