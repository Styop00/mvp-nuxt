<template>
  <div class="py-2 sm:py-4 lg:p-6 px-2 sm:px-4">
    <div class="rounded-lg overflow-hidden pb-4 animate-fade-in">
      <div>
        <Breadcrumb/>
        <div class="bg-surface-default min-w-full shadow-sm rounded-2xl overflow-hidden border border-border-default transition-[background-color,border-color,box-shadow] duration-200">
          <!-- Header Section -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-border-default bg-gradient-to-r from-surface-default/50 to-bg-primary/30 transition-[background-color,border-color] duration-200">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-text-primary transition-colors duration-200">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"/>
              Calendar
            </p>
          </div>
          
          <!-- Filter Section -->
          <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-stretch lg:items-center justify-between px-4 lg:px-6 py-5 bg-gradient-to-br from-surface-default/40 via-bg-primary/30 to-surface-default/40 border-b border-border-default backdrop-blur-sm relative transition-[background-color,border-color] duration-200">
            <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
              <div class="flex items-center gap-3 relative z-30">
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 shadow-sm hover:shadow-sm hover:border-brand-primary/30 transition-all duration-200">
                  <font-awesome :icon="['fas', 'filter']" class="text-brand-primary-color text-sm"/>
                  <span class="text-nowrap text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider whitespace-nowrap transition-colors duration-200">Filters</span>
                </div>
                <div class="relative z-30">
                  <Select
                      :options="filterOptions"
                      v-model:value="filter"
                      v-show="filterOptions.length > 1"
                      class="w-full sm:w-auto sm:min-w-[140px]"
                  />
                </div>
              </div>
              
              <div class="flex items-center gap-3 relative z-30" v-if="filter.value === 'court'">
                <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10 transition-all duration-200 flex-shrink-0">
                  <font-awesome :icon="['fas', 'location-dot']" class="text-xs text-text-tertiary group-hover:text-brand-primary transition-colors"/>
                </div>
                <div class="relative z-30">
                  <FilterSelect
                      :options="courts"
                      v-model:value="selectedCourt"
                      class="w-full sm:w-auto sm:min-w-[280px] flex-1"
                  />
                </div>
              </div>
              
              <div class="flex items-center gap-3 relative z-30" v-if="filter.value === 'coach'">
                <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10 transition-all duration-200 flex-shrink-0">
                  <font-awesome :icon="['fas', 'user']" class="text-xs text-text-tertiary group-hover:text-brand-primary transition-colors"/>
                </div>
                <div class="relative z-30">
                  <FilterSelect
                      :options="clubUserOptions"
                      v-model:value="selectedUserId"
                      class="w-full sm:w-auto sm:min-w-[280px] flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Calendar Container -->
          <div class="p-2 sm:p-4 lg:p-6 overflow-x-auto relative">
            <FullCalendar 
              ref="calendarRef"
              :options='calendarOptionsRef' 
              class="calendar-wrapper"
            />
          </div>
          
          <!-- Mobile View Toggle Buttons -->
          <div class="flex flex-wrap gap-2 justify-center px-4 pb-4 lg:hidden border-t border-border-default pt-4 transition-[border-color] duration-200">
            <button
              @click="changeView('listWeek')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'listWeek' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-surface-elevated text-text-secondary hover:bg-bg-hover transition-[background-color,color] duration-200'
              ]"
            >
              List
            </button>
            <button
              @click="changeView('dayGridMonth')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'dayGridMonth' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-surface-elevated text-text-secondary hover:bg-bg-hover transition-[background-color,color] duration-200'
              ]"
            >
              Month
            </button>
            <button
              @click="changeView('timeGridWeek')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'timeGridWeek' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-surface-elevated text-text-secondary hover:bg-bg-hover transition-[background-color,color] duration-200'
              ]"
            >
              Week
            </button>
            <button
              @click="changeView('timeGridDay')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'timeGridDay' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-surface-elevated text-text-secondary hover:bg-bg-hover transition-[background-color,color] duration-200'
              ]"
            >
              Day
            </button>
          </div>
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

const calendarRef = ref<any>(null)
const currentView = ref('dayGridMonth')

const calendarOptionsRef = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  weekends: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'listYear,dayGridMonth,timeGridWeek,timeGridDay'
  },
  firstDay: 1,
  dayHeaderFormat: { weekday: 'short' },
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
    listWeek: {
      listDayFormat: { weekday: 'short', day: 'numeric' },
      listDaySideFormat: false,
    },
  },
  eventDidMount: (info: any) => {
    // Set the description as a native tooltip
    info.el.setAttribute('title', info.event.title);
  },
  events: []
})

const changeView = (view: string) => {
  currentView.value = view
  if (calendarRef.value) {
    const api = calendarRef.value.getApi()
    if (api) {
      api.changeView(view)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    if (calendarRef.value) {
      const api = calendarRef.value.getApi()
      if (api) {
        currentView.value = api.view.type
        api.on('viewChange', () => {
          currentView.value = api.view.type
        })
      }
    }
  })
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

  calendarOptionsRef.value.events = res.map((event: any) => {
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
  const userClub = userStore.user.user_roles
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

<style scoped>
/* Calendar Wrapper - Remove any bottom shadow */
.calendar-wrapper {
  background: transparent;
}

/* Remove bottom shadow from calendar container and all FullCalendar elements */
.calendar-wrapper :deep(.fc-scrollgrid),
.calendar-wrapper :deep(.fc-view),
.calendar-wrapper :deep(.fc-daygrid-body),
.calendar-wrapper :deep(.fc-timegrid),
.calendar-wrapper :deep(.fc-list-view) {
  box-shadow: none !important;
}

/* FullCalendar Theme-Aware Styling - Using CSS Variables */
:deep(.fc) {
  background-color: transparent !important;
  color: var(--color-text-primary) !important;
  font-family: inherit;
  border-color: var(--color-border-default) !important;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Theme-aware borders using CSS variables */
:deep(.fc *),
:deep(.fc table),
:deep(.fc table *),
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid *),
:deep(.fc-daygrid),
:deep(.fc-daygrid *),
:deep(.fc-timegrid),
:deep(.fc-timegrid *) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc table td),
:deep(.fc table th),
:deep(.fc-scrollgrid td),
:deep(.fc-scrollgrid th) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-section),
:deep(.fc-scrollgrid-section-header),
:deep(.fc-scrollgrid-section-body),
:deep(.fc-scrollgrid-sync-table) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-daygrid-body),
:deep(.fc-daygrid-body-unbalanced),
:deep(.fc-daygrid-day-frame),
:deep(.fc-daygrid-day-top) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Header Toolbar - Theme-aware */
:deep(.fc-header-toolbar) {
  margin-bottom: 1.5rem !important;
  padding: 1rem 1.25rem !important;
  background: linear-gradient(135deg, var(--color-surface-elevated) 0%, var(--color-bg-tertiary) 50%, var(--color-surface-elevated) 100%) !important;
  border-radius: 1rem !important;
  border: 1px solid var(--color-border-default) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  backdrop-filter: blur(8px) !important;
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 1rem !important;
  position: relative !important;
  z-index: 1 !important;
  transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: var(--color-text-primary) !important;
  text-transform: capitalize;
  letter-spacing: 0.025em;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Toolbar Chunks */
:deep(.fc-toolbar-chunk) {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

:deep(.fc-toolbar-chunk:first-child) {
  flex: 0 0 auto !important;
}

:deep(.fc-toolbar-chunk:nth-child(2)) {
  flex: 1 1 auto !important;
  justify-content: center !important;
  text-align: center !important;
}

:deep(.fc-toolbar-chunk:last-child) {
  flex: 0 0 auto !important;
  justify-content: flex-end !important;
}

/* Buttons - Theme-aware */
:deep(.fc-button-primary) {
  background: var(--color-surface-elevated) !important;
  border: 1px solid var(--color-border-default) !important;
  color: var(--color-text-primary) !important;
  border-radius: 0.625rem !important;
  padding: 0.625rem 1.25rem !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: capitalize !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.fc-button-primary::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

:deep(.fc-button-primary:hover::before) {
  left: 100%;
}

:deep(.fc-button-primary:hover) {
  background: var(--color-bg-hover) !important;
  border-color: #ef4444 !important; /* brand-primary color */
  color: #ef4444 !important; /* brand-primary color */
  transform: translateY(-1px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.fc-button-primary:not(:disabled):active) {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background: #ef4444 !important; /* brand-primary color */
  border-color: #ef4444 !important; /* brand-primary color */
  color: #FFFFFF !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-1px);
}

:deep(.fc-button-primary:focus) {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
  outline: none !important;
}

:deep(.fc-button-primary:disabled) {
  background: var(--color-bg-tertiary) !important;
  border-color: var(--color-border-default) !important;
  color: var(--color-text-disabled) !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

/* Button Group - Theme-aware */
:deep(.fc-button-group) {
  display: inline-flex !important;
  gap: 0.375rem !important;
  border-radius: 0.625rem !important;
  padding: 0.25rem !important;
  background: var(--color-bg-tertiary) !important;
  border: 1px solid var(--color-border-default) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-button-group .fc-button) {
  margin: 0 !important;
  border-radius: 0.5rem !important;
}

:deep(.fc-button-group .fc-button:not(:first-child)) {
  margin-left: 0 !important;
}

/* Prev/Next Buttons */
:deep(.fc-prev-button),
:deep(.fc-next-button) {
  min-width: 44px !important;
  min-height: 44px !important;
  padding: 0.625rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover) {
  background: #ef4444 !important; /* brand-primary color */
  border-color: #ef4444 !important; /* brand-primary color */
  color: #FFFFFF !important;
}

/* Today Button */
:deep(.fc-today-button) {
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
}

/* View Toggle Buttons - Theme-aware */
:deep(.fc-button-group .fc-button-primary.fc-button-active) {
  background: #ef4444 !important; /* brand-primary color */
  border-color: #ef4444 !important; /* brand-primary color */
  color: #FFFFFF !important;
  font-weight: 700 !important;
  position: relative !important;
}

:deep(.fc-button-group .fc-button-primary.fc-button-active::after) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
  border-radius: 2px;
}

/* Icon buttons enhancement - Theme-aware */
:deep(.fc-icon) {
  transition: transform 200ms;
}

:deep(.fc-button-primary:hover .fc-icon) {
  transform: scale(1.1);
}

/* Today button special styling */
:deep(.fc-today-button) {
  position: relative;
  overflow: hidden;
}

:deep(.fc-today-button::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1), transparent);
  opacity: 0;
  transition: opacity 200ms;
}

:deep(.fc-today-button:hover::after) {
  opacity: 1;
}

/* Separator between button groups - Theme-aware */
:deep(.fc-toolbar-chunk:not(:last-child)::after) {
  content: '';
  display: none;
}

@media (min-width: 769px) {
  :deep(.fc-toolbar-chunk:not(:last-child):not(:first-child)::after) {
    display: block;
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, transparent, var(--color-border-default), transparent);
    margin: 0 0.5rem;
  }
}

/* Day Headers - Theme-aware */
:deep(.fc-col-header-cell) {
  background-color: var(--color-surface-elevated) !important;
  border-color: var(--color-border-default) !important;
  padding: 0.75rem !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-col-header-cell-cushion) {
  color: var(--color-text-primary) !important;
  font-weight: 600 !important;
  text-transform: capitalize;
  font-size: 0.875rem;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Calendar Grid - Theme-aware */
:deep(.fc-daygrid-day) {
  background-color: var(--color-surface-default) !important;
  border-color: var(--color-border-default) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Remove any white borders */
:deep(.fc-daygrid-day-frame) {
  border-color: transparent !important;
}

:deep(.fc-daygrid-day-top) {
  border-color: transparent !important;
}

/* Table borders - Theme-aware */
:deep(.fc-scrollgrid) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-section) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-sync-table) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-sync-table td),
:deep(.fc-scrollgrid-sync-table th) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-section-header td),
:deep(.fc-scrollgrid-section-header th) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-scrollgrid-section-body td),
:deep(.fc-scrollgrid-section-body th) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-daygrid-day:hover) {
  background-color: var(--color-bg-hover) !important;
}

:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-color: #ef4444 !important; /* brand-primary color */
}

:deep(.fc-daygrid-day-number) {
  color: var(--color-text-primary) !important;
  padding: 0.5rem !important;
  font-weight: 500;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
  color: #ef4444 !important; /* brand-primary color */
  font-weight: 700;
}

/* Other Month Days - Theme-aware */
:deep(.fc-day-other .fc-daygrid-day-number) {
  color: var(--color-text-tertiary) !important;
  opacity: 0.5;
}

/* Events - Brand color (same in both themes) */
:deep(.fc-event) {
  background-color: #ef4444 !important; /* brand-primary color */
  border-color: #ef4444 !important; /* brand-primary color */
  color: #FFFFFF !important;
  border-radius: 0.375rem !important;
  padding: 0.25rem 0.5rem !important;
  margin: 0.125rem !important;
  cursor: pointer !important;
  transition: all 200ms !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
}

:deep(.fc-event:hover) {
  background-color: #818CF8 !important; /* brand-primary hover */
  border-color: #818CF8 !important; /* brand-primary hover */
  transform: translateY(-1px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.fc-event-title) {
  color: #FFFFFF !important;
  font-weight: 500 !important;
}

/* Time Grid (Week/Day View) - Theme-aware */
:deep(.fc-timegrid-slot) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-slot-label) {
  color: var(--color-text-tertiary) !important;
  font-size: 0.75rem !important;
  border-color: var(--color-border-default) !important;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-col) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-col-frame) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-axis) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-divider) {
  border-color: var(--color-border-default) !important;
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-timegrid-now-indicator-line) {
  border-color: #ef4444 !important; /* brand-primary color */
}

/* List View - Theme-aware */
:deep(.fc-list-day-cushion) {
  background-color: var(--color-surface-elevated) !important;
  color: var(--color-text-primary) !important;
  font-weight: 600 !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-list-event) {
  background-color: var(--color-surface-default) !important;
  border-color: var(--color-border-default) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-list-event:hover) {
  background-color: var(--color-bg-hover) !important;
}

:deep(.fc-list-event-title) {
  color: var(--color-text-primary) !important;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-list-event-time) {
  color: var(--color-text-tertiary) !important;
  transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* More Link - Brand color */
:deep(.fc-more-link) {
  color: #ef4444 !important; /* brand-primary color */
  font-weight: 500 !important;
}

:deep(.fc-more-link:hover) {
  color: #818CF8 !important; /* brand-primary hover */
  text-decoration: underline;
}

/* Scrollbar for calendar - Theme-aware */
:deep(.fc-scroller) {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-light) var(--color-surface-elevated);
}

:deep(.fc-scroller::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.fc-scroller::-webkit-scrollbar-track) {
  background: var(--color-surface-elevated);
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.fc-scroller::-webkit-scrollbar-thumb) {
  background: var(--color-border-light);
  border-radius: 3px;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.fc-scroller::-webkit-scrollbar-thumb:hover) {
  background: var(--color-border-default);
}

/* Popover - Theme-aware */
:deep(.fc-popover) {
  background-color: var(--color-surface-elevated) !important;
  border-color: var(--color-border-default) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-popover-header) {
  background-color: var(--color-surface-default) !important;
  color: var(--color-text-primary) !important;
  border-color: var(--color-border-default) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.fc-popover-body) {
  background-color: var(--color-surface-elevated) !important;
  color: var(--color-text-primary) !important;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.fc-header-toolbar) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem !important;
    border-radius: 0.875rem !important;
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    width: 100%;
  }
  
  :deep(.fc-toolbar-chunk:first-child),
  :deep(.fc-toolbar-chunk:last-child) {
    justify-content: center !important;
  }
  
  :deep(.fc-toolbar-title) {
    font-size: 1.25rem !important;
    text-align: center;
    width: 100%;
    margin: 0.25rem 0;
    order: -1;
  }
  
  :deep(.fc-button-primary) {
    padding: 0.625rem 1rem !important;
    font-size: 0.875rem !important;
    min-height: 44px !important;
    min-width: 44px !important;
    border-radius: 0.5rem !important;
  }
  
  :deep(.fc-button-group) {
    width: 100%;
    justify-content: center;
    padding: 0.375rem !important;
  }
  
  :deep(.fc-button-group .fc-button) {
    padding: 0.5rem 0.875rem !important;
    min-height: 44px !important;
    flex: 1 1 auto;
    max-width: 120px;
  }
  
  :deep(.fc-prev-button),
  :deep(.fc-next-button),
  :deep(.fc-today-button) {
    min-width: 44px !important;
    min-height: 44px !important;
  }
  
  :deep(.fc-col-header-cell) {
    padding: 0.5rem 0.25rem !important;
  }
  
  :deep(.fc-col-header-cell-cushion) {
    font-size: 0.75rem !important;
    padding: 0.25rem !important;
  }
  
  :deep(.fc-daygrid-day-number) {
    padding: 0.375rem !important;
    font-size: 0.875rem !important;
  }
  
  :deep(.fc-daygrid-day) {
    min-height: 60px !important;
  }
  
  :deep(.fc-event) {
    font-size: 0.7rem !important;
    padding: 0.125rem 0.375rem !important;
    margin: 0.0625rem !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.7rem !important;
    line-height: 1.2 !important;
  }
  
  :deep(.fc-scroller) {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }
  
  :deep(.fc-daygrid-body) {
    overflow-x: auto !important;
  }
  
  :deep(.fc-view-harness) {
    overflow-x: auto !important;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  :deep(.fc-toolbar-title) {
    font-size: 1rem !important;
  }
  
  :deep(.fc-button-primary) {
    padding: 0.5rem !important;
    font-size: 0.75rem !important;
  }
  
  :deep(.fc-col-header-cell-cushion) {
    font-size: 0.7rem !important;
  }
  
  :deep(.fc-daygrid-day-number) {
    font-size: 0.75rem !important;
    padding: 0.25rem !important;
  }
  
  :deep(.fc-daygrid-day) {
    min-height: 50px !important;
  }
}
</style>
