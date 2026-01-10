<template>
  <BaseModalComponent v-model:visible="modal" :width="5" name="_time_slots">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold mb-5 border-b">
        {{ timeSlotId ? 'Update time' : 'Add new time' }}
      </p>
      <form action="#"
            class="min-h-[60vh] flex flex-col justify-between"
            @submit.prevent="createOrUpdate">
        <div>
          <div class="flex flex-col gap-3">
            <div class="grid-cols-1 sm:grid-cols-2 grid gap-8">
              <div>
                <template v-if="userStore.isAdmin">
                  <Select v-model:value="selectedVenue"
                          label="Venue"
                          :required="true"
                          :options="venueOptions"
                  />
                  <p v-show="venueError" class="text-xs text-red-500">
                    {{ venueError }}
                  </p>
                </template>
                <template v-else>
                  <Select v-model:value="selectedClub"
                          label="Club"
                          :required="true"
                          :options="clubs"/>
                  <p v-show="clubError" class="text-xs text-red-500">
                    {{ clubError }}
                  </p>
                </template>
              </div>
              <div>
                <Select v-model:value="selectedCourt"
                        label="Court"
                        :required="true"
                        :options="courts"/>
                <p v-show="courtError" class="text-xs text-red-500">
                  {{ courtError }}
                </p>
              </div>
            </div>
            <div class="grid-cols-1 sm:grid-cols-3 grid gap-8">
              <div class="relative">
                <TextInput
                    :value="date"
                    label="Date"
                    @click.stop.prevent="() => {closeDropdowns(); showDateCalendar = true}"
                    :prevent-input="true"
                    :required="true"
                    placeholder="Date"
                />
                <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                     @click.stop
                     v-if="showDateCalendar"
                     style="z-index: 99999 !important; position: absolute !important;">
                  <DatePicker
                      v-model:model-value="date"
                      color="blue"
                      @close="closeDropdowns"
                      :min-date="moment().toDate()"/>
                </div>
              </div>
              <div>
                <TextInput v-model:value="startTime"
                           label="Start Time"
                           :required="true"
                           placeholder="Start Time"
                />
                <p v-if="startTimeError" class="text-xs text-red-500">
                  {{ startTimeError }}
                </p>
              </div>
              <div>
                <TextInput v-model:value="endTime"
                           label="End Time"
                           :required="true"
                           placeholder="End Time"
                />
                <p v-if="endTimeError" class="text-xs text-red-500">
                  {{ endTimeError }}
                </p>
              </div>
            </div>
            <div class="grid-cols-1 sm:grid-cols-3 grid gap-8">
              <div class="relative">
                <TextInput
                    :value="expiredAt"
                    label="Expires On"
                    @click.stop.prevent="() => {closeDropdowns(); showExpirationDateCalendar = true}"
                    :prevent-input="true"
                    :required="true"
                    placeholder="Last date that time slot can be reserved"
                />
                <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                     @click.stop
                     v-if="showExpirationDateCalendar"
                     style="z-index: 99999 !important; position: absolute !important;">
                  <DatePicker
                      v-model:model-value="expiredAt"
                      :max-date="date"
                      :min-date="moment().toDate()"
                      color="blue"
                      @close="closeDropdowns"/>
                </div>
              </div>
              <template v-if="createWeekly">
                <Switch
                    v-model:value="fixDatesDifferent"
                    checked-label="Use dates difference"
                    labelStyles="!text-sm"
                    class="border border-brand-blue-300/50 rounded-xl p-2"
                />
              </template>
            </div>
          </div>
          <template v-if="!timeSlotId">
            <CheckBox
                v-model:value="createWeekly"
                label="Create the same time every week for the rest of the season. Times can be deleted/corrected individually afterwards"
                name="visible_weekly"
                class="mt-4"
            />
          </template>
          <p class="mt-4 text-xs p-2 border border-brand-blue-200 rounded-xl text-brand-primary-color">
            Note: You must state the time from when you have the hall and not when you expect the first match to start.
            When determining times, the association takes into account time for warm-up
          </p>

          <template v-if="date && expiredAt && createWeekly">
            <p class="mt-4 text-xs p-2 border border-brand-blue-200 rounded-xl text-brand-primary-color">
              Note:
              <template v-if="fixDatesDifferent">
                All created time slots expire {{ moment(date).diff(moment(expiredAt), 'days') }} days before the
                time slot date.
              </template>
              <template v-else>
                All created time slots until the end of the season expire on {{ expiredAt }}
              </template>
            </p>
          </template>
        </div>
        <BaseButton class="!py-2 block my-5 mt-10 mx-auto">
          {{ timeSlotId ? 'Update' : 'Add' }}
        </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import {useTimeSlotsFetch} from "~/composables/useTimeSlotsFetch/useTimeSlotsFetch";
import {useCourtsFetch} from "~/composables/useCourtsFetch/useCourtsFetch";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import TextInput from "~/components/inputs/TextInput.vue";
import CheckBox from "~/components/inputs/CheckBox.vue";
import moment from "moment";
import Select from "~/components/inputs/Select.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import Switch from "~/components/inputs/Switch.vue";
import {useVenuesFetch} from "~/composables/useVenuesFetch/useVenuesFetch";
import type Venues from "~/interfaces/venues/venues";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  timeSlotId: {
    type: Number,
    default: 0
  }
})

const {fetchTimeSlotById, updateTimeSlot, createTimeSlot} = useTimeSlotsFetch()
const {fetchCourtsForClubs} = useCourtsFetch()
const {fetchAllClubs} = useClubsFetch()
const {fetchAllVenues} = useVenuesFetch()

const userStore = useUserStore()

const modal = ref(false)
const venues = ref([] as Array<Venues>)
const venueOptions = ref([] as Array<SelectOptions>)
const courts = ref([] as Array<SelectOptions>)
const clubs = ref([] as Array<SelectOptions>)
const selectedVenue = ref({} as SelectOptions)
const selectedCourt = ref({} as SelectOptions)
const selectedClub = ref({} as SelectOptions)
const date = ref('')
const expiredAt = ref('')
const showDateCalendar = ref(false)
const showExpirationDateCalendar = ref(false)
const createWeekly = ref(false)
const fixDatesDifferent = ref(false)
const startTime = ref('')
const endTime = ref('')
const startTimeError = ref('')
const endTimeError = ref('')
const clubError = ref('')
const courtError = ref('')
const venueError = ref('')

const emit = defineEmits([
  'update:visible',
  'update:timeSlotId',
  'reFetch'
])

watch(() => props.visible, async () => {
  if (props.visible) {
    if (userStore.isAdmin) {
      await fetchVenues()
    } else {
      await fetchData()
    }
  } else {
    date.value = ''
    startTime.value = ''
    endTime.value = ''
    selectedClub.value = clubs.value[0]
    selectedCourt.value = courts.value[0]
    courts.value = []

    selectedVenue.value = venueOptions.value[0]
    createWeekly.value = false
    clubError.value = ''
    courtError.value = ''
    venueError.value = ''
    expiredAt.value = ''
  }

  if (props.timeSlotId) {
    await fetchTimeSlot()
  }
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:timeSlotId', 0)
    emit('update:visible', false)
  }
})


watch(() => startTime.value, (newVal, oldVal) => {
  if (newVal.length > oldVal.length && newVal.length === 2) {
    startTime.value += ':'
    return
  }
  startTimeError.value = '';
  if (startTime.value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(startTime.value as string)) {
      startTimeError.value = errorMessage
    } else if (startTime.value && endTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch(() => endTime.value, (newVal, oldVal) => {
  if (newVal.length > oldVal.length && newVal.length === 2) {
    endTime.value += ':'
    return
  }
  endTimeError.value = ''
  if (endTime.value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(endTime.value as string)) {
      endTimeError.value = errorMessage
    } else if (endTime.value && startTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch(() => selectedVenue.value?.value, () => {
  const venue = venues.value.find(venue => venue.id === selectedVenue.value?.value)
  if (venue) {
    courts.value = venue.courts.map(court => {
      return {
        label: court.name,
        value: court.id,
        disabled: false
      }
    })

    courts.value.unshift({
      label: '--- Select court ---',
      value: null,
      disabled: true
    })

    selectedCourt.value = courts.value[0]
  } else {
    courts.value = [{
      label: '--- Select court ---',
      value: null,
      disabled: true
    }]
  }
})

function compareTimes() {
  if (!endTime.value || !startTime.value) {
    return
  }
  startTimeError.value = '';
  endTimeError.value = '';

  const referenceDate = new Date();

  const date1 = new Date(referenceDate);
  const date2 = new Date(referenceDate);

  const [hours1, minutes1] = startTime.value.split(':').map(Number);
  const [hours2, minutes2] = endTime.value.split(':').map(Number);

  date1.setHours(hours1, minutes1, 0, 0);
  date2.setHours(hours2, minutes2, 0, 0);

  if (date1 > date2) {
    startTimeError.value = 'Start time should be earlier than end time.'
    endTimeError.value = 'End time should be later than start time.'
  }
}

async function fetchTimeSlot() {
  const res = await fetchTimeSlotById(props.timeSlotId)
  date.value = moment(res.date as string).format('YYYY-MM-DD');
  expiredAt.value = moment(res.expiration as string).format('YYYY-MM-DD');
  startTime.value = moment(res.start_time as string, 'HH:mm').format('HH:mm');
  endTime.value = moment(res.end_time as string, 'HH:mm').format('HH:mm');
  let courtData;
  if (userStore.isAdmin) {
    const venue = venues.value.find(venue => venue.id === res.court.venue_id)
    if (venue) {
      selectedVenue.value = {
        label: venue.name,
        disabled: false,
        value: venue.id
      }

      courts.value = venue.courts.map(court => {
        return {
          label: court.name,
          value: court.id,
          disabled: false
        }
      })

      courts.value.unshift({
        label: '--- Select court ---',
        value: null,
        disabled: true
      })

      const court = courts.value.find(court => court.value === res.court_id)
      if (court) {
        setTimeout(() => {
          selectedCourt.value = court
        })
      }
    }
  } else {
    courtData = courts.value.find(court => court.value === res.court_id)
  }
  if (courtData) {
    selectedCourt.value = courtData
  }
  selectedClub.value = clubs.value.find(club => club.value === res.club_id) as SelectOptions
}

async function createOrUpdate() {
  if (startTimeError.value || endTimeError.value) return

  clubError.value = ''
  courtError.value = ''
  venueError.value = ''
  if (!selectedClub.value?.value && !userStore.isAdmin) {
    clubError.value = 'Club is required.'
  }

  if (!selectedCourt.value.value) {
    courtError.value = 'Court is required.'
  }

  if (!selectedVenue.value?.value && userStore.isAdmin) {
    venueError.value = 'Venue is required.'
  }

  if (clubError.value || courtError.value || venueError.value) {
    return
  }

  if (props.timeSlotId) {
    const res = await updateTimeSlot(props.timeSlotId, {
      date: date.value,
      startTime: startTime.value,
      endTime: endTime.value,
      clubId: selectedClub.value?.value ? selectedClub.value.value : null,
      courtId: selectedCourt.value.value,
      expiration: expiredAt.value,
    })

    if (res) {
      modal.value = false
      emit('reFetch')
    }
  } else {
    const res = await createTimeSlot({
      date: date.value,
      start_time: startTime.value,
      end_time: endTime.value,
      club_id: selectedClub.value?.value ? selectedClub.value.value : null,
      court_id: selectedCourt.value.value,
      create_weekly: createWeekly.value,
      season_sport_id: userStore.seasonSportId,
      expiration: expiredAt.value,
      ...(createWeekly.value ? {use_different: fixDatesDifferent.value} : {}),
    })

    if (res) {
      modal.value = false
      emit('reFetch')
    }
  }
}

async function fetchVenues() {
  venues.value = await fetchAllVenues({
    seasonSportId: userStore.seasonSportId
  })

  venueOptions.value = venues.value.map((venue) => {
    return {
      label: venue.name,
      value: venue.id,
      disabled: false
    }
  })

  venueOptions.value.unshift({
    label: '--- Select venue ---',
    value: null,
    disabled: true
  })

  selectedVenue.value = venueOptions.value[0]
  courts.value = [{
    label: '--- Select court ---',
    value: null,
    disabled: true
  }]
  selectedCourt.value = courts.value[0]
}

async function fetchData() {
  const clubManagerClubs = userStore.user.user_roles
      .filter((userRole: any) => userRole.roleId === 1)
      .map((userRole: any) => userRole.clubId);

  const availableCourts = await fetchCourtsForClubs(clubManagerClubs)
  courts.value = availableCourts.map(court => {
    return {
      label: court.venue.name + ' ' + court.name,
      value: court.id,
      disabled: false
    }
  })
  courts.value.unshift({
    label: '--- Select court ---',
    value: null,
    disabled: true
  })
  selectedCourt.value = courts.value[0]

  const availableClubs = await fetchAllClubs({clubIds: clubManagerClubs})
  clubs.value = availableClubs.map(club => {
    return {
      label: club.name,
      value: club.id,
      disabled: false
    }
  })
  clubs.value.unshift({
    label: '--- Select club ---',
    value: null,
    disabled: true
  })
  selectedClub.value = clubs.value[0]
}

function closeDropdowns() {
  showDateCalendar.value = false
  showExpirationDateCalendar.value = false
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.click()
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_time_slots')
  if (modal) {
    modal.addEventListener('click', () => closeDropdowns())
  }
})
</script>
