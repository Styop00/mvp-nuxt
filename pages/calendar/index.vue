<template>
  <div class="py-2 sm:py-4 lg:p-6 px-2 sm:px-4">
    <div class="rounded-lg overflow-hidden pb-4 animate-fade-in">
      <div>
        <Breadcrumb/>
        <div class="bg-dark-surface-default min-w-full shadow-xl rounded-2xl overflow-hidden border border-dark-border-default">
          <!-- Header Section -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-dark-border-default bg-gradient-to-r from-dark-surface-default/50 to-dark-bg-primary/30">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-dark-text-primary">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-violet-500 via-indigo-500 to-sky-400 mr-3 shadow-sm"/>
              Calendar
            </p>
          </div>
          
          <!-- Filter Section -->
          <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-stretch lg:items-center justify-between px-4 lg:px-6 py-5 bg-gradient-to-br from-dark-surface-default/40 via-dark-bg-primary/30 to-dark-surface-default/40 border-b border-dark-border-default backdrop-blur-sm relative">
            <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
              <div class="flex items-center gap-3 relative z-30">
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary-color/10 to-brand-primary-color/5 border border-brand-primary-color/20 shadow-sm hover:shadow-md hover:border-brand-primary-color/30 transition-all duration-200">
                  <font-awesome :icon="['fas', 'filter']" class="text-brand-primary-color text-sm"/>
                  <span class="text-nowrap text-xs sm:text-sm font-bold text-dark-text-primary uppercase tracking-wider whitespace-nowrap">Filters</span>
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
                <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-dark-surface-elevated border border-dark-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                  <font-awesome :icon="['fas', 'location-dot']" class="text-xs text-dark-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
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
                <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-dark-surface-elevated border border-dark-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                  <font-awesome :icon="['fas', 'user']" class="text-xs text-dark-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
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
          <div class="flex flex-wrap gap-2 justify-center px-4 pb-4 lg:hidden border-t border-dark-border-default pt-4">
            <button
              @click="changeView('listWeek')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'listWeek' 
                  ? 'bg-brand-primary-color text-white shadow-md' 
                  : 'bg-dark-surface-elevated text-dark-text-secondary hover:bg-dark-bg-hover'
              ]"
            >
              List
            </button>
            <button
              @click="changeView('dayGridMonth')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'dayGridMonth' 
                  ? 'bg-brand-primary-color text-white shadow-md' 
                  : 'bg-dark-surface-elevated text-dark-text-secondary hover:bg-dark-bg-hover'
              ]"
            >
              Month
            </button>
            <button
              @click="changeView('timeGridWeek')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'timeGridWeek' 
                  ? 'bg-brand-primary-color text-white shadow-md' 
                  : 'bg-dark-surface-elevated text-dark-text-secondary hover:bg-dark-bg-hover'
              ]"
            >
              Week
            </button>
            <button
              @click="changeView('timeGridDay')"
              :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-11',
                currentView === 'timeGridDay' 
                  ? 'bg-brand-primary-color text-white shadow-md' 
                  : 'bg-dark-surface-elevated text-dark-text-secondary hover:bg-dark-bg-hover'
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
/* Calendar Wrapper */
.calendar-wrapper {
  background: transparent;
}

/* FullCalendar Dark Theme Styling */
:deep(.fc) {
  background-color: transparent !important;
  color: #F1F5F9 !important;
  font-family: inherit;
  border-color: #334155 !important;
}

/* Remove all white borders - comprehensive override */
:deep(.fc *),
:deep(.fc table),
:deep(.fc table *),
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid *),
:deep(.fc-daygrid),
:deep(.fc-daygrid *),
:deep(.fc-timegrid),
:deep(.fc-timegrid *) {
  border-color: #334155 !important;
}

:deep(.fc table td),
:deep(.fc table th),
:deep(.fc-scrollgrid td),
:deep(.fc-scrollgrid th) {
  border-color: #334155 !important;
  border-right-color: #334155 !important;
  border-bottom-color: #334155 !important;
  border-top-color: #334155 !important;
  border-left-color: #334155 !important;
}

/* Ensure no white or light borders anywhere */
:deep(.fc-scrollgrid-section),
:deep(.fc-scrollgrid-section-header),
:deep(.fc-scrollgrid-section-body),
:deep(.fc-scrollgrid-sync-table) {
  border-color: #334155 !important;
}

/* Day grid specific */
:deep(.fc-daygrid-body),
:deep(.fc-daygrid-body-unbalanced),
:deep(.fc-daygrid-day-frame),
:deep(.fc-daygrid-day-top) {
  border-color: #334155 !important;
}

/* Header Toolbar */
:deep(.fc-header-toolbar) {
  margin-bottom: 1.5rem !important;
  padding: 1rem 1.25rem !important;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(30, 41, 59, 0.6) 100%) !important;
  border-radius: 1rem !important;
  border: 1px solid rgba(51, 65, 85, 0.5) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(8px) !important;
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 1rem !important;
  position: relative !important;
  z-index: 1 !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #F1F5F9 !important;
  text-transform: capitalize;
  letter-spacing: 0.025em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* Buttons */
:deep(.fc-button-primary) {
  background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
  border: 1px solid #475569 !important;
  color: #F1F5F9 !important;
  border-radius: 0.625rem !important;
  padding: 0.625rem 1.25rem !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: capitalize !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
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
  background: linear-gradient(135deg, #475569 0%, #64748B 100%) !important;
  border-color: #6366F1 !important;
  color: #FFFFFF !important;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 12px -2px rgba(99, 102, 241, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
}

:deep(.fc-button-primary:not(:disabled):active) {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%) !important;
  border-color: #6366F1 !important;
  color: #FFFFFF !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3), 0 4px 6px -1px rgba(99, 102, 241, 0.4) !important;
  transform: translateY(-1px);
}

:deep(.fc-button-primary:focus) {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3) !important;
  outline: none !important;
}

:deep(.fc-button-primary:disabled) {
  background: linear-gradient(135deg, #1E293B 0%, #334155 100%) !important;
  border-color: #334155 !important;
  color: #64748B !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

/* Button Group */
:deep(.fc-button-group) {
  display: inline-flex !important;
  gap: 0.375rem !important;
  border-radius: 0.625rem !important;
  padding: 0.25rem !important;
  background: rgba(15, 23, 42, 0.3) !important;
  border: 1px solid rgba(51, 65, 85, 0.3) !important;
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
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%) !important;
}

/* Today Button */
:deep(.fc-today-button) {
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
}

/* View Toggle Buttons */
:deep(.fc-button-group .fc-button-primary.fc-button-active) {
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%) !important;
  border-color: #6366F1 !important;
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

/* Icon buttons enhancement */
:deep(.fc-icon) {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
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

/* Enhanced button group container */
:deep(.fc-button-group) {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Separator between button groups */
:deep(.fc-toolbar-chunk:not(:last-child)::after) {
  content: '';
  display: none;
}

@media (min-width: 769px) {
  :deep(.fc-toolbar-chunk:not(:last-child):not(:first-child)::after) {
    display: block;
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, transparent, rgba(51, 65, 85, 0.5), transparent);
    margin: 0 0.5rem;
  }
}

/* Day Headers */
:deep(.fc-col-header-cell) {
  background-color: #1E293B !important;
  border-color: #334155 !important;
  border-right-color: #334155 !important;
  border-bottom-color: #334155 !important;
  border-top-color: #334155 !important;
  border-left-color: #334155 !important;
  padding: 0.75rem !important;
}

:deep(.fc-col-header-cell-cushion) {
  color: #F1F5F9 !important;
  font-weight: 600 !important;
  text-transform: capitalize;
  font-size: 0.875rem;
}

/* Calendar Grid */
:deep(.fc-daygrid-day) {
  background-color: #0F172A !important;
  border-color: #334155 !important;
  border-right-color: #334155 !important;
  border-bottom-color: #334155 !important;
  border-top-color: #334155 !important;
  border-left-color: #334155 !important;
  transition: background-color 200ms !important;
}

/* Remove any white borders */
:deep(.fc-daygrid-day-frame) {
  border-color: transparent !important;
}

:deep(.fc-daygrid-day-top) {
  border-color: transparent !important;
}

/* Table borders */
:deep(.fc-scrollgrid) {
  border-color: #334155 !important;
}

:deep(.fc-scrollgrid-section) {
  border-color: #334155 !important;
}

:deep(.fc-scrollgrid-sync-table) {
  border-color: #334155 !important;
}

:deep(.fc-scrollgrid-sync-table td),
:deep(.fc-scrollgrid-sync-table th) {
  border-color: #334155 !important;
  border-right-color: #334155 !important;
  border-bottom-color: #334155 !important;
}

:deep(.fc-scrollgrid-section-header td),
:deep(.fc-scrollgrid-section-header th) {
  border-color: #334155 !important;
}

:deep(.fc-scrollgrid-section-body td),
:deep(.fc-scrollgrid-section-body th) {
  border-color: #334155 !important;
}

:deep(.fc-daygrid-day:hover) {
  background-color: #1E293B !important;
}

:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(99, 102, 241, 0.1) !important;
  border-color: #6366F1 !important;
}

:deep(.fc-daygrid-day-number) {
  color: #F1F5F9 !important;
  padding: 0.5rem !important;
  font-weight: 500;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
  color: #6366F1 !important;
  font-weight: 700;
}

/* Other Month Days */
:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #64748B !important;
  opacity: 0.5;
}

/* Events */
:deep(.fc-event) {
  background-color: #6366F1 !important;
  border-color: #6366F1 !important;
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
  background-color: #818CF8 !important;
  border-color: #818CF8 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
}

:deep(.fc-event-title) {
  color: #FFFFFF !important;
  font-weight: 500 !important;
}

/* Time Grid (Week/Day View) */
:deep(.fc-timegrid-slot) {
  border-color: #334155 !important;
  border-top-color: #334155 !important;
  border-bottom-color: #334155 !important;
}

:deep(.fc-timegrid-slot-label) {
  color: #94A3B8 !important;
  font-size: 0.75rem !important;
  border-color: #334155 !important;
}

:deep(.fc-timegrid-col) {
  border-color: #334155 !important;
  border-left-color: #334155 !important;
  border-right-color: #334155 !important;
}

:deep(.fc-timegrid-col-frame) {
  border-color: #334155 !important;
}

:deep(.fc-timegrid-axis) {
  border-color: #334155 !important;
}

:deep(.fc-timegrid-divider) {
  border-color: #334155 !important;
}

:deep(.fc-timegrid-now-indicator-line) {
  border-color: #6366F1 !important;
}

/* List View */
:deep(.fc-list-day-cushion) {
  background-color: #1E293B !important;
  color: #F1F5F9 !important;
  font-weight: 600 !important;
}

:deep(.fc-list-event) {
  background-color: #0F172A !important;
  border-color: #334155 !important;
}

:deep(.fc-list-event:hover) {
  background-color: #1E293B !important;
}

:deep(.fc-list-event-title) {
  color: #F1F5F9 !important;
}

:deep(.fc-list-event-time) {
  color: #94A3B8 !important;
}

/* More Link */
:deep(.fc-more-link) {
  color: #6366F1 !important;
  font-weight: 500 !important;
}

:deep(.fc-more-link:hover) {
  color: #818CF8 !important;
  text-decoration: underline;
}

/* Scrollbar for calendar */
:deep(.fc-scroller) {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1E293B;
}

:deep(.fc-scroller::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.fc-scroller::-webkit-scrollbar-track) {
  background: #1E293B;
}

:deep(.fc-scroller::-webkit-scrollbar-thumb) {
  background: #475569;
  border-radius: 3px;
}

:deep(.fc-scroller::-webkit-scrollbar-thumb:hover) {
  background: #64748B;
}

/* Popover */
:deep(.fc-popover) {
  background-color: #1E293B !important;
  border-color: #334155 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
}

:deep(.fc-popover-header) {
  background-color: #334155 !important;
  color: #F1F5F9 !important;
  border-color: #475569 !important;
}

:deep(.fc-popover-body) {
  background-color: #1E293B !important;
  color: #F1F5F9 !important;
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
