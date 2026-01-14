<template>
  <div>
    <div class="gap-8 items-top justify-start flex-wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div class="flex flex-col gap-4 md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-wrap items-top justify-start">
          <div class="flex flex-col gap-4">
            <TextInput v-model:value="tournamentGroup.name as string"
                       label="Name"
                       :required="true"
                       placeholder="Name"
            />
            <div class="relative">
              <TextInput
                  v-model:value="tournamentGroup.start_date"
                  label="Start Date"
                  placeholder="Start Date"
                  @click.stop.prevent="() => {closeCalendars(); showStartDateCalendar = true}"
                  :prevent-input="true"
                  :required="true"
              />
              <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                   @click.stop
                   v-if="showStartDateCalendar"
                   style="z-index: 99999 !important; position: absolute !important;">
                <DatePicker
                    v-model:model-value="tournamentGroup.start_date"
                    :min-date="league ? league.start_date : null"
                    color="blue"
                    :max-date="league ? league.end_date : null"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <TextInput v-model:value="tournamentGroup.short_name as string"
                       label="Short Name"
                       :required="true"
                       placeholder="Short Name"
            />
            <div class="relative">
              <TextInput
                  :value="tournamentGroup.end_date"
                  label="End Date"
                  placeholder="End Date"
                  @click.stop.prevent="() => {closeCalendars(); showEndDateCalendar = true}"
                  :prevent-input="true"
                  :required="true"
              />
              <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow" @click.stop
                   v-if="showEndDateCalendar"
                   style="z-index: 99999 !important; position: absolute !important;">
                <DatePicker v-model:model-value="tournamentGroup.end_date"
                            :min-date="tournamentGroup.start_date ?? ''"
                            color="blue"
                            :max-date="league ? league.end_date : null"
                />
              </div>

            </div>
            <Select :options="registrationTypes" v-model:value="registrationType" label="Registration Type"/>
          </div>
        </div>
        <Select :options="structures" v-model:value="structure" label="Structure"/>
        <Select :options="tournamentTypes" v-model:value="tournamentType" label="Tournament Type"/>
        <div class="flex gap-4 flex-wrap items-top justify-start">
          <TextInput v-model:value="tournamentGroup.min_teams" label="Min Teams" :required="true" type="number"/>
          <div>
            <TextInput v-model:value="tournamentGroup.max_teams" label="Max Teams" type="number"/>
            <span v-if="errors?.maxTeams" class="text-xs text-red-600">
              {{ errors?.maxTeams }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 items-top justify-start">
        <div class="flex gap-4 items-top justify-between flex-wrap">
          <Select :options="ageGroups"
                  class="w-72"
                  v-model:value="ageGroup"
                  label="Year"/>

        </div>
        <Select :options="matchTimes"
                v-model:value="matchTime"
                label="Match Time"/>

      </div>
      <div class="flex flex-col gap-4 items-top justify-start">
        <Select :options="genders"
                class="w-72"
                v-model:value="gender"
                label="Gender"/>
        <Select :options="combatMoves"
                v-model:value="combatMove"
                label="Combat moves"/>
      </div>
    </div>
    <TextArea v-model:value="tournamentGroup.information"
              label="Public Information"
              class="mt-8"/>
  </div>
</template>

<script setup lang="ts">

import CheckBox from "~/components/inputs/CheckBox.vue";
import TextArea from "~/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import {useTournamentStructureStore} from "~/store/tournamentStructure";
import {useTournamentRegistrationTypeStore} from "~/store/tournamentRegistrationTypes";
import {useTournamentTypeStore} from "~/store/tournamentTypes";
import moment from "moment/moment";
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";
import type League from "~/interfaces/league/leagues";

const props = defineProps<{
  tournamentGroup?: TournamentGroup;
  errors?: {}
}>();

const route = useRoute()
const leagueId = route.params.leagueId
const tournamentGroup = ref({} as TournamentGroup)
const ageGroup = ref({} as SelectOptions)
const gender = ref({} as SelectOptions)
const showStartDateCalendar = ref(false)
const showEndDateCalendar = ref(false)
const structure = ref({} as SelectOptions)
const registrationType = ref({} as SelectOptions)
const matchTime = ref({} as SelectOptions)
const combatMove = ref({} as SelectOptions)
const tournamentType = ref({} as SelectOptions)
const league = ref({} as League)

const structuresStore = useTournamentStructureStore()
const tournamentTypesStore = useTournamentTypeStore()
const registrationTypesStore = useTournamentRegistrationTypeStore()

const {fetchLeagueById} = useLeagueFetch()

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

const tournamentTypes = computed(() => {
  if (tournamentTypesStore.types.length) {
    return tournamentTypesStore.types.map((type) => {
      return {
        label: type.name,
        value: type.id,
        disabled: false
      } as SelectOptions
    })
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

watch(() => tournamentGroup.value.start_date, () => {
  if (tournamentGroup.value.end_date && moment(tournamentGroup.value.end_date.toString()).isBefore(moment(tournamentGroup.value.start_date?.toString()))) {
    tournamentGroup.value.end_date = ''
  }
}, {
  deep: true,
  immediate: true
})

watch(() => structures.value, () => {
  if (!structures.value.length) {
    structuresStore.fetchTournamentStructures()
  } else if (props.tournamentGroup) {
    structure.value = structures.value.find(structure => structure.value === props.tournamentGroup?.tournament_structure_id) as SelectOptions
  }
}, {
  deep: true,
  immediate: true
})

watch(() => tournamentTypes.value, () => {
  if (!tournamentTypes.value.length) {
    tournamentTypesStore.fetchTournamentTypes()
  } else if (props.tournamentGroup?.tournament_type_id !== undefined) {
    const type = tournamentTypes.value.find(type => type.value === props.tournamentGroup?.tournament_type_id) as SelectOptions
    if (type) {
      tournamentType.value = type
    } else {
      tournamentType.value = {
        label: '',
        value: props.tournamentGroup?.tournament_type_id,
        disabled: false
      }
    }
  }
}, {
  deep: true,
  immediate: true
})

watch(() => registrationTypes.value, () => {
  if (!registrationTypes.value.length) {
    registrationTypesStore.fetchTournamentRegistrationTypes()
  } else if (props.tournamentGroup) {
    registrationType.value = registrationTypes.value.find(registrationType => registrationType.value === props.tournamentGroup?.tournament_registration_type_id) as SelectOptions
  }
}, {
  deep: true,
  immediate: true
})

watch(() => props.tournamentGroup, () => {
  if (!props.tournamentGroup) {
    return
  }

  tournamentGroup.value = {...props.tournamentGroup}

  gender.value = genders.find(gender => gender.value === tournamentGroup.value.gender) as SelectOptions
  ageGroup.value = ageGroups.find(ageGroup => ageGroup.value === tournamentGroup.value.age_group) as SelectOptions
  structure.value = structures.value.find(structure => structure.value === tournamentGroup.value.tournament_structure_id) as SelectOptions
  registrationType.value = registrationTypes.value.find(registrationType => registrationType.value === tournamentGroup.value.tournament_registration_type_id) as SelectOptions
  matchTime.value = matchTimes.find(matchTime => matchTime.value == tournamentGroup.value.set_game_strategy_id) as SelectOptions
  combatMove.value = combatMoves.find(combatMove => combatMove.value === tournamentGroup.value.moving_strategy_id) as SelectOptions
  const type = tournamentTypes.value.find(type => type.value === props.tournamentGroup?.tournament_type_id) as SelectOptions
  if (type) {
    tournamentType.value = type
  } else if (props.tournamentGroup?.tournament_type_id !== undefined) {
    tournamentType.value = {
      label: '',
      value: props.tournamentGroup?.tournament_type_id,
      disabled: false
    }
  }
}, {
  deep: true,
  immediate: true
})

function closeCalendars() {
  showStartDateCalendar.value = false
  showEndDateCalendar.value = false
}

const editData = computed(() => {
  return {
    ...tournamentGroup.value,
    tournament_registration_type_id: registrationType.value?.value ? registrationType.value?.value : null,
    gender: gender.value?.value ? gender.value?.value : null,
    ageGroup: ageGroup.value?.value ? ageGroup.value?.value : null,
    tournament_structure_id: structure.value?.value ? structure.value?.value : null,
    setGameStrategyId: matchTime.value?.value ? matchTime.value?.value : 0,
    movingStrategyId: combatMove.value?.value ? combatMove.value?.value : null,
    tournament_type_id: tournamentType.value?.value !== undefined ? tournamentType.value?.value : null,
  }
})

onMounted(async () => {
  league.value = await fetchLeagueById(+leagueId)
})

defineExpose({
  closeCalendars,
  editData
})

</script>
