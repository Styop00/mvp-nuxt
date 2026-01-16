<template>
  <div class="space-y-8">
    <!-- Section 1: Basic Information -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-blue-500/20 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="section-title">Basic Information</h3>
      </div>
      <div class="section-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextInput v-model:value="tournament.name as string"
                     label="Name"
                     :required="true"
                     placeholder="Tournament name"
          />
          <TextInput v-model:value="tournament.short_name as string"
                     label="Short Name"
                     :required="true"
                     placeholder="Short name"
          />
          <Select :options="ageGroups"
                  v-model:value="ageGroup"
                  label="Age Group"/>
          <Select :options="genders"
                  v-model:value="gender"
                  label="Gender"/>
        </div>
        <div class="mt-4">
          <Select :options="regions"
                  v-model:value="region"
                  label="Region"
                  ref="regionsRef"
                  class="max-w-xs"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Schedule & Dates -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-green-500/20 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="section-title">Schedule & Dates</h3>
      </div>
      <div class="section-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Start Date -->
          <div class="relative">
            <TextInput
                v-model:value="tournament.start_date"
                label="Start Date"
                placeholder="Start Date"
                @click.stop.prevent="() => {closeCalendars(); showStartDateCalendar = true}"
                :prevent-input="true"
                :required="true"
            />
            <div class="!absolute !z-[9999] top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showStartDateCalendar"
            >
              <DatePicker
                  v-model:model-value="tournament.start_date"
                  :min-date="league ? league.start_date : null"
                  color="blue"
                  :max-date="league ? league.end_date : null"
                  format="DD-MM-YYYY"
              />
            </div>
          </div>
          <!-- End Date -->
          <div class="relative">
            <TextInput
                :value="tournament.end_date"
                label="End Date"
                placeholder="End Date"
                @click.stop.prevent="() => {closeCalendars(); showEndDateCalendar = true}"
                :prevent-input="true"
                :required="true"
            />
            <div class="!absolute !z-[9999] top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showEndDateCalendar"
            >
              <DatePicker v-model:model-value="tournament.end_date"
                          :min-date="tournament.start_date ?? ''"
                          color="blue"
                          :max-date="league ? league.end_date : null"
                          format="DD-MM-YYYY"
              />
            </div>
          </div>
          <!-- Earliest Start Time -->
          <div>
            <TextInput v-model:value="tournament.earliest_start as string"
                       label="Earliest Start Time"
                       :required="true"
                       placeholder="00:00"/>
            <p v-if="startTimeError" class="text-xs text-red-500 mt-1">
              {{ startTimeError }}
            </p>
          </div>
          <!-- Latest Start Time -->
          <div>
            <TextInput v-model:value="tournament.latest_start as string"
                       label="Latest Start Time"
                       :required="true"
                       placeholder="00:00"/>
            <p v-if="endTimeError" class="text-xs text-red-500 mt-1">
              {{ endTimeError }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <!-- Registration Deadline -->
          <div class="relative">
            <TextInput
                v-model:value="tournament.registration_dead_line"
                label="Registration Deadline"
                placeholder="Registration Deadline"
                @click.stop.prevent="() => {closeCalendars(); showRegistrationDeadlineCalendar = true}"
                :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow" @click.stop
                 v-if="showRegistrationDeadlineCalendar">
              <DatePicker v-model:model-value="tournament.registration_dead_line" color="blue" format="DD-MM-YYYY"/>
            </div>
          </div>
          <!-- Free Reschedule Until -->
          <div class="relative">
            <TextInput
                v-model:value="tournament.free_reschedule_until_date"
                label="Free Movement Until"
                placeholder="Free movement until"
                @click.stop.prevent="() => {closeCalendars(); showFreeRescheduleCalendar = true}"
                :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                 @click.stop
                 v-if="showFreeRescheduleCalendar">
              <DatePicker v-model:model-value="tournament.free_reschedule_until_date" color="blue" format="DD-MM-YYYY"/>
            </div>
          </div>
          <Select :options="registrationTypes" v-model:value="registrationType" label="Registration Type"/>
        </div>
      </div>
    </div>

    <!-- Section 3: Match Settings -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-purple-500/20 text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="section-title">Match Settings</h3>
      </div>
      <div class="section-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextInput
              type="number"
              v-model:value="tournament.expected_duration_minutes"
              :required="true"
              :min="0"
              label="Expected Match Duration (min)"/>
          <TextInput
              type="number"
              v-model:value="tournament.minimum_warmup_minutes"
              :required="true"
              :min="0"
              label="Minimum Warmup (min)"/>
          <Select :options="matchTimes"
                  v-model:value="matchTime"
                  label="Match Time Setting"/>
          <Select :options="combatMoves"
                  v-model:value="combatMove"
                  label="Game Movement Rules"/>
        </div>
      </div>
    </div>

    <!-- Section 4: Tournament Structure -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-amber-500/20 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </div>
        <h3 class="section-title">Tournament Structure</h3>
      </div>
      <div class="section-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select :options="structures" v-model:value="structure" label="Tournament Structure"/>
          <TextInput v-model:value="tournament.team_count" label="Team Count" :required="true" type="number" :min="0"/>
          <TextInput
              v-model:value="tournament.pool_count"
              label="Number of Pools"
              type="number"
              :min="0"
              placeholder="0"
          />
          <TextInput
              v-model:value="tournament.standing_group_count"
              label="Position Groups"
              type="number"
              :min="0"
              placeholder="0"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <TextInput v-model:value="tournament.cross_pool_game_count"
                     label="Matches Between Pools"
                     placeholder="0"
                     type="number"
                     :min="0"
          />
          <TextInput v-model:value="tournament.cross_standing_group_game_count"
                     label="Intermatches Across Position Groups"
                     placeholder="0"
                     type="number"
                     :min="0"
          />
          <Select :options="programs"
                  v-model:value="program"
                  label="Program Schema"
                  ref="programSchemaRef"
          />
          <Select :options="roundTypes"
                  v-model:value="roundType"
                  label="Round Type"
                  ref="roundTypesRef"
          />
        </div>

        <!-- Pools Configuration -->
        <div v-if="pools.length" class="mt-6 p-4 rounded-lg border border-border-default bg-surface-elevated">
          <h4 class="text-sm font-semibold mb-4 text-text-primary">Pool Configuration</h4>
          <div class="grid grid-cols-3 gap-4 mb-2 text-xs font-medium text-text-tertiary uppercase tracking-wider">
            <p>Pool Name <span class="text-red-500">*</span></p>
            <p>Teams Count <span class="text-red-500">*</span></p>
            <p>Games Between <span class="text-red-500">*</span></p>
          </div>
          <template v-for="(pool, index) in pools" :key="index">
            <div class="grid grid-cols-3 gap-4 mb-3">
              <TextInput v-model:value="pool.name" :required="true" placeholder="Pool name"/>
              <TextInput v-model:value="pool.teams_count" type="number" :required="true" placeholder="0"
                         :min="0" :max="tournament.team_count"/>
              <TextInput v-model:value="pool.games_between" type="number" :required="true" placeholder="0"
                         :min="0"/>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Section 5: Rounds Configuration -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-cyan-500/20 text-cyan-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="section-title">Rounds</h3>
      </div>
      <div class="section-content">
        <div class="flex items-center gap-4">
          <template v-if="!rounds.length">
            <div class="relative group">
              <BaseButton class="!py-2 !px-6"
                          :class="!tournament.start_date || !tournament.end_date ? 'bg-brand-primary-color/20 hover:!bg-brand-primary-color/20 cursor-not-allowed' : ''"
                          :type="!tournament.start_date || !tournament.end_date ? 'submit' : 'button'"
                          @onClick="() => emitCalculateRounds()">
                Calculate Rounds
              </BaseButton>
              <template v-if="!tournament.start_date || !tournament.end_date">
                <span
                    class="absolute bottom-full mb-2 text-xs tracking-wider group-hover:!inline-block hidden bg-surface-elevated left-1/2 py-1 px-3 -translate-x-1/2 border border-border-default rounded shadow-lg whitespace-nowrap">
                  Start Date and End Date fields are required
                </span>
              </template>
            </div>
          </template>
          <template v-else>
            <BaseButton class="!py-2 !px-6 bg-red-600 hover:bg-red-700"
                        type="button"
                        @onClick="() => emit('delete-rounds')">
              Delete Rounds
            </BaseButton>
            <span class="text-sm text-text-tertiary">{{ rounds.length }} round(s) configured</span>
          </template>
        </div>
        <div v-if="rounds.length" class="mt-4">
          <RoundsTable v-model:rounds="rounds"/>
        </div>
      </div>
    </div>

    <!-- Section 6: Additional Information -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon bg-rose-500/20 text-rose-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="section-title">Additional Information</h3>
      </div>
      <div class="section-content">
        <TextArea v-model:value="tournament.information"
                  label="Public Information"
                  placeholder="Enter any additional information about the tournament..."/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import TextArea from "~/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type Tournament from "~/interfaces/tournament/tournament";
import {useTournamentStructureStore} from "~/store/tournamentStructure";
import {useTournamentRegistrationTypeStore} from "~/store/tournamentRegistrationTypes";
import moment from "moment/moment";
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";
import type League from "~/interfaces/league/leagues";
import type Pools from "~/interfaces/pools/pools";
import {useTournamentProgramStore} from "~/store/tournamentPrograms";
import BaseButton from "~/components/buttons/BaseButton.vue";
import RoundsTable from "~/components/tables/RoundsTable.vue";
import type Rounds from "~/interfaces/rounds/rounds";
import {useRegionStore} from "~/store/region";
import {useUserStore} from "~/store/user";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";

const props = defineProps<{
  tournament?: Tournament;
  pools?: Array<Pools>;
  rounds?: Array<Rounds>;
  errors?: {}
}>();

const emit = defineEmits(['update:tournament', 'update:pools', 'update:rounds', 'calculate-rounds', 'delete-rounds']);

const route = useRoute()
const leagueId = route.params.leagueId
const tournamentId = route.params.tournamentId

const tournament = ref({} as Tournament)
const ageGroup = ref({} as SelectOptions)
const gender = ref({} as SelectOptions)
const showStartDateCalendar = ref(false)
const showEndDateCalendar = ref(false)
const showRegistrationDeadlineCalendar = ref(false)
const showFreeRescheduleCalendar = ref(false)
const startTimeError = ref('')
const endTimeError = ref('')
const structure = ref({} as SelectOptions)
const registrationType = ref({} as SelectOptions)
const matchTime = ref({} as SelectOptions)
const combatMove = ref({} as SelectOptions)
const league = ref({} as League)
const program = ref({} as SelectOptions)
const region = ref({} as SelectOptions)
const roundType = ref({} as SelectOptions)
const pools = ref([] as Array<Pools>)
const rounds = ref([] as Array<Rounds>)
const roundTypesRef = ref<InstanceType<typeof Select> | null>(null)
const regionsRef = ref<InstanceType<typeof Select> | null>(null)
const programSchemaRef = ref<InstanceType<typeof Select> | null>(null)

const structuresStore = useTournamentStructureStore()
const registrationTypesStore = useTournamentRegistrationTypeStore()
const programsStore = useTournamentProgramStore()
const regionStore = useRegionStore()
const userStore = useUserStore()

const {fetchLeagueById} = useLeagueFetch()
const {fetchTournamentById} = useTournamentFetch()

const ageGroups = [
  {
    label: 'Senior',
    value: 'Senior',
    disabled: false
  },
  {
    label: 'Oldies',
    value: 'Oldies',
    disabled: false
  },
  {
    label: 'U-23',
    value: 'U-23',
    disabled: false
  },
  {
    label: 'U-22',
    value: 'U-22',
    disabled: false
  },
  {
    label: 'U-21',
    value: 'U-21',
    disabled: false
  },
  {
    label: 'U-20',
    value: 'U-20',
    disabled: false
  },
  {
    label: 'U-19',
    value: 'U-19',
    disabled: false
  },
  {
    label: 'U-18',
    value: 'U-18',
    disabled: false
  },
  {
    label: 'U-17',
    value: 'U-17',
    disabled: false
  },
  {
    label: 'U-16',
    value: 'U-16',
    disabled: false
  },
  {
    label: 'U-15',
    value: 'U-15',
    disabled: false
  },
  {
    label: 'U-14',
    value: 'U-14',
    disabled: false
  },
  {
    label: 'U-13',
    value: 'U-13',
    disabled: false
  },
  {
    label: 'U-12',
    value: 'U-12',
    disabled: false
  },
  {
    label: 'U-11',
    value: 'U-11',
    disabled: false
  },
  {
    label: 'U-10',
    value: 'U-10',
    disabled: false
  },
  {
    label: 'U-9',
    value: 'U-93',
    disabled: false
  },
  {
    label: 'U-8',
    value: 'U-83',
    disabled: false
  },
  {
    label: 'U-7',
    value: 'U-73',
    disabled: false
  },
  {
    label: 'U-6',
    value: 'U-63',
    disabled: false
  },
  {
    label: 'U-5',
    value: 'U-53',
    disabled: false
  },
] as Array<SelectOptions>

const genders = [
  {
    label: 'Man',
    value: 'M',
    disabled: false
  },
  {
    label: 'Women',
    value: 'W',
    disabled: false
  },
  {
    label: 'Mix',
    value: 'B',
    disabled: false
  },
] as Array<SelectOptions>

const matchTimes = [
  {
    label: 'Can only be set by the organizer',
    value: 0,
    disabled: false
  },
  {
    label: 'Liquidator can determine before the deadline',
    value: 1,
    disabled: false
  },
] as Array<SelectOptions>

const combatMoves = [
  {
    label: 'Can only be moved by the organizer',
    value: 0,
    disabled: false
  },
  {
    label: 'Free until the deadline, after that only the organizer',
    value: 1,
    disabled: false
  },
  {
    label: 'Free until the deadline, then only with opponent acceptance',
    value: 2,
    disabled: false
  },
] as Array<SelectOptions>

const roundTypes = [
  {
    label: 'Week based',
    value: 0,
    disabled: false,
  },
  {
    label: 'Convention based',
    value: 1,
    disabled: false,
  },
] as Array<SelectOptions>

const structures = computed(() => {
  const tournamentStructures = [
    {
      label: 'none (matches are created manually)',
      value: null,
      disabled: false
    }
  ]
  if (structuresStore.structures.length) {
    structuresStore.structures.forEach((structure) => {
      tournamentStructures.push({
        label: structure.name,
        value: structure.id,
        disabled: false
      })
    })
    return tournamentStructures
  }
  return []
})

const registrationTypes = computed(() => {
  if (registrationTypesStore.registrationTypes.length) {
    return registrationTypesStore.registrationTypes.map((registrationType) => {
      return {
        label: registrationType.name,
        value: registrationType.id,
        disabled: false
      } as SelectOptions
    })
  }
  return []
})

const programs = computed(() => {
  const tournamentPrograms: Array<SelectOptions> = [
    {
      label: 'Automatic',
      value: 0,
      disabled: false
    }
  ]
  if (programsStore.programs.length) {
    programsStore.programs.forEach((program) => {
      tournamentPrograms.push({
        label: program.name,
        value: program.id,
        disabled: false
      })
    })
    return tournamentPrograms
  }
  return tournamentPrograms
})

const regions = computed(() => {
  const regionsOptions: Array<SelectOptions> = [
    {
      label: 'None',
      value: null,
      disabled: false
    }
  ]
  if (regionStore.regions.length) {
    regionStore.regions.forEach((region) => {
      if (region.seasonSportId === userStore.seasonSportId) {
        regionsOptions.push({
          label: region.name,
          value: region.id,
          disabled: false
        })
      }
    })
    return regionsOptions
  }
  return []
})

function formatToDisplayDate(date: string | null | undefined): string {
  if (!date) return ''
  const parsed = moment(date, ['DD-MM-YYYY', 'YYYY-MM-DD'], true)
  if (parsed.isValid()) {
    return parsed.format('DD-MM-YYYY')
  }
  return date
}

watch(() => props.tournament, () => {
  if (!props.tournament) {
    return
  }

  tournament.value = {...props.tournament}

  if (tournament.value?.start_date) {
    tournament.value.start_date = formatToDisplayDate(tournament.value.start_date as string)
  }
  if (tournament.value?.end_date) {
    tournament.value.end_date = formatToDisplayDate(tournament.value.end_date as string)
  }
  if (tournament.value?.registration_dead_line) {
    tournament.value.registration_dead_line = formatToDisplayDate(tournament.value.registration_dead_line as string)
  }
  if (tournament.value?.free_reschedule_until_date) {
    tournament.value.free_reschedule_until_date = formatToDisplayDate(tournament.value.free_reschedule_until_date as string)
  }

  gender.value = genders.find(gender => gender.value === tournament.value.gender) as SelectOptions
  ageGroup.value = ageGroups.find(ageGroup => ageGroup.value === tournament.value.age_group) as SelectOptions
  structure.value = structures.value.find(structure => structure.value === tournament.value.tournament_structure_id) as SelectOptions
  registrationType.value = registrationTypes.value.find(registrationType => registrationType.value === tournament.value.tournament_registration_type_id) as SelectOptions
  matchTime.value = matchTimes.find(matchTime => matchTime.value == tournament.value.set_game_strategy_id) as SelectOptions
  combatMove.value = combatMoves.find(combatMove => combatMove.value === tournament.value.moving_strategy_id) as SelectOptions

  if (tournament.value.tournament_program_id) {
    program.value = programs.value.find(program => program.value === tournament.value.tournament_program_id) as SelectOptions
  } else {
    program.value = programs.value[0]
  }
  region.value = regions.value.find(region => region.value === tournament.value.region_id) as SelectOptions
  roundType.value = roundTypes.find(type => type.value === tournament.value.round_type) as SelectOptions
}, {
  deep: true,
  immediate: true
})

watch(() => tournament.value, () => {
  if (JSON.stringify(tournament.value) !== JSON.stringify(props.tournament)) {
    emit('update:tournament', {...tournament.value})
  }
}, {
  deep: true,
  immediate: true
})

watch(() => tournament.value.start_date, () => {
  if (tournament.value.end_date && tournament.value.start_date) {
    const endDate = moment(tournament.value.end_date.toString(), 'DD-MM-YYYY', true)
    const startDate = moment(tournament.value.start_date.toString(), 'DD-MM-YYYY', true)
    if (endDate.isValid() && startDate.isValid() && endDate.isBefore(startDate)) {
      tournament.value.end_date = ''
    }
  }
}, {
  deep: true,
  immediate: true
})

watch(() => structures.value, () => {
  if (!structures.value.length) {
    structuresStore.fetchTournamentStructures()
  } else if (props.tournament) {
    structure.value = structures.value.find(structure => structure.value === props.tournament?.tournament_structure_id) as SelectOptions
  }
}, {
  deep: true,
  immediate: true
})

watch(() => registrationTypes.value, () => {
  if (!registrationTypes.value.length) {
    registrationTypesStore.fetchTournamentRegistrationTypes()
  } else if (props.tournament) {
    registrationType.value = registrationTypes.value.find(registrationType => registrationType.value === props.tournament?.tournament_registration_type_id) as SelectOptions
  }
}, {
  deep: true,
  immediate: true
})

watch(() => props.rounds, () => {
  rounds.value = JSON.parse(JSON.stringify(props.rounds || []))
}, {
  deep: true,
  immediate: true
})

watch(() => rounds.value, () => {
  if (JSON.stringify(rounds.value) !== JSON.stringify(props.rounds || [])) {
    emit('update:rounds', [...rounds.value])
  }
}, {
  deep: true,
  immediate: true
})

watch(() => pools.value, () => {
  if (JSON.stringify(pools.value) !== JSON.stringify(props.pools || [])) {
    emit('update:pools', [...pools.value])
  }
}, {
  deep: true,
  immediate: true
})

watch(() => props.pools, () => {
  pools.value = JSON.parse(JSON.stringify(props.pools || []))
}, {
  deep: true,
  immediate: true
})

watch(() => program.value, () => {
  tournament.value.tournament_program_id = +program.value?.value
}, {
  deep: true,
  immediate: true
})

watch(() => roundType.value, () => {
  tournament.value.round_type = +roundType.value?.value
}, {
  deep: true,
  immediate: true
})

watch(() => tournament.value.pool_count, (value, oldValue) => {
  if (!value) {
    value = 0
  }
  if (+value < pools.value.length) {
    pools.value.splice(+value, pools.value.length - (+value))
  } else if (+value === (tournament.value.pools?.length || 0)) {
    pools.value = JSON.parse(JSON.stringify(tournament.value.pools || []))
  } else {
    for (let i = pools.value.length; i < +value; i++) {
      if (tournament.value.pools?.[i]) {
        pools.value.push({...tournament.value.pools[i]})
      } else {
        pools.value.push({
          id: 0,
          name: `Pool ${pools.value.length + 1}`,
          tournament_id: tournament.value.id,
          games_between: 2,
          teams_count: 0,
          deleted: false,
        })
      }
    }
  }
})

watch(() => programs.value, () => {
  if (!programs.value.length || programs.value.length === 1) {
    programsStore.fetchTournamentPrograms()
  }
}, {
  deep: true,
  immediate: true
})

watch(() => regions.value, () => {
  if (!regions.value.length) {
    regionStore.fetchRegions()
  }
}, {
  deep: true,
  immediate: true
})

watch(() => tournament.value.earliest_start, (newVal, oldVal) => {
  if (oldVal && newVal && newVal?.length > oldVal?.length && newVal?.length === 2) {
    tournament.value.earliest_start += ':'
    return
  }
  startTimeError.value = '';
  if (tournament.value.earliest_start) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(tournament.value.earliest_start as string)) {
      startTimeError.value = errorMessage
    } else if (tournament.value.latest_start && endTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch(() => tournament.value.latest_start, (newVal, oldVal) => {
  if (oldVal && newVal && newVal?.length > oldVal?.length && newVal?.length === 2) {
    tournament.value.latest_start += ':'
    return
  }
  endTimeError.value = ''
  if (tournament.value.latest_start) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(tournament.value.latest_start as string)) {
      endTimeError.value = errorMessage
    } else if (tournament.value.earliest_start && startTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

function compareTimes() {
  if (!tournament.value.latest_start || !tournament.value.earliest_start) {
    return
  }
  startTimeError.value = '';
  endTimeError.value = '';

  const referenceDate = new Date();

  const date1 = new Date(referenceDate);
  const date2 = new Date(referenceDate);

  const [hours1, minutes1] = tournament.value.earliest_start.split(':').map(Number);
  const [hours2, minutes2] = tournament.value.latest_start.split(':').map(Number);

  date1.setHours(hours1, minutes1, 0, 0);
  date2.setHours(hours2, minutes2, 0, 0);

  if (date1 > date2) {
    startTimeError.value = 'Earliest start time should be earlier.'
    endTimeError.value = 'Latest start time should be later.'
  }
}

function closeCalendars() {
  showStartDateCalendar.value = false
  showEndDateCalendar.value = false
  showRegistrationDeadlineCalendar.value = false
  showFreeRescheduleCalendar.value = false
  roundTypesRef.value?.closeDropdown()
  regionsRef.value?.closeDropdown()
  programSchemaRef.value?.closeDropdown()
}

function emitCalculateRounds() {
  if (!tournament.value.start_date || !tournament.value.end_date) {
    return
  }

  emit('calculate-rounds')
}

async function fetchGroup() {
  if (tournamentId) {
    tournament.value = await fetchTournamentById(+tournamentId)
  }
}

const editData = computed(() => {
  // Convert dates from DD-MM-YYYY (display format) to YYYY-MM-DD (API format)
  const convertDate = (date: string | null | undefined): string | null => {
    if (!date) return null
    const parsed = moment(date, 'DD-MM-YYYY', true)
    if (parsed.isValid()) {
      return parsed.format('YYYY-MM-DD')
    }
    // If already in YYYY-MM-DD format, return as is
    return date
  }

  return {
    ...tournament.value,
    start_date: convertDate(tournament.value.start_date),
    end_date: convertDate(tournament.value.end_date),
    registration_dead_line: convertDate(tournament.value.registration_dead_line),
    free_reschedule_until_date: convertDate(tournament.value.free_reschedule_until_date),
    tournament_registration_type_id: registrationType.value?.value ? registrationType.value?.value : null,
    gender: gender.value?.value ? gender.value?.value : null,
    age_group: ageGroup.value?.value ? ageGroup.value?.value : null,
    tournament_structure_id: structure.value?.value ? structure.value?.value : null,
    set_game_strategy_id: matchTime.value?.value ? matchTime.value?.value : 0,
    moving_strategy_id: combatMove.value?.value ? combatMove.value?.value : null,
  }
})

onMounted(async () => {
  document.body.addEventListener('click', closeCalendars)
  if (leagueId) {
    league.value = await fetchLeagueById(+leagueId)
  }
  if (tournamentId) {
    await fetchGroup()
  }
})

defineExpose({
  closeCalendars,
  editData,
  startTimeError,
  endTimeError
})

</script>

<style scoped>
.form-section {
  @apply rounded-xl border;
  background: var(--color-surface-default);
  border-color: var(--color-border-default);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-header {
  @apply flex items-center gap-3 px-5 py-4 border-b;
  background: var(--color-surface-elevated);
  border-color: var(--color-border-default);
}

.section-icon {
  @apply w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0;
}

.section-title {
  @apply text-base font-semibold;
  color: var(--color-text-primary);
}

.section-content {
  @apply p-5;
}

/* Override input backgrounds for better visibility in sections */
.form-section :deep(.bg-dark-surface-elevated) {
  background: var(--color-bg-tertiary);
}

/* Pool configuration card */
.border-border-default {
  border-color: var(--color-border-default);
}

.bg-surface-elevated {
  background: var(--color-surface-elevated);
}

.text-text-primary {
  color: var(--color-text-primary);
}

.text-text-tertiary {
  color: var(--color-text-tertiary);
}
</style>

