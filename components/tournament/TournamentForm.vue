<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <div class="grid md:grid-cols-2 gap-4">
        <TextInput v-model:value="tournament.alias"
                   label="Name"
                   :required="true"
                   placeholder="Name"
        />
        <TextInput v-model:value="tournament.short_name"
                   label="Short Name"
                   :required="true"
                   placeholder="Short name"
        />
      </div>
      <div class="grid md:grid-cols-2 gap-6 mt-4">
        <div class="relative">
          <TextInput
              :value="tournament.start_date"
              label="Start Date"
              placeholder="Start Date"
              @click.stop.prevent="() => {closeCalendars(); showStartDateCalendar = true}"
              :prevent-input="true"
              :required="true"
          />
          <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow" @click.stop
               v-if="showStartDateCalendar">
            <DatePicker v-model:model-value="tournament.start_date"
                        :min-date="tournamentGroup?.start_date ?? moment()"
                        :max-date="tournamentGroup?.end_date ?? null"
                        color="blue"/>
          </div>

        </div>
        <div class="relative">
          <TextInput
              :value="tournament.end_date"
              label="End Date"
              placeholder="End Date"
              @click.stop="() => {closeCalendars(); showEndDateCalendar = true}"
              :prevent-input="true"
              :required="true"
          />
          <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow" @click.stop
               v-if="showEndDateCalendar">
            <DatePicker v-model:model-value="tournament.end_date"
                        :min-date="tournament.start_date ?? ''"
                        :max-date="tournamentGroup?.end_date ?? null"
                        color="blue"/>
          </div>

        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <TextInput
            v-model:value="tournament.pool_count"
            label="Pools"
            type="number"
            :min="0"
            placeholder="Pools"
        />
        <TextInput
            v-model:value="tournament.standing_group_count"
            label="Position Groups"
            type="number"
            :min="0"
            placeholder="Position Groups"
        />
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <TextInput
            v-model:value="tournament.team_count"
            label="Number of Teams"
            type="number"
            :min="0"
            placeholder="Number of teams"
        />
        <Select :options="programs"
                v-model:value="program"
                label="Program Schema"
                ref="programSchemaRef"
        />
      </div>
      <div v-if="pools.length">
        <div class="grid grid-cols-3 gap-4 mt-4">
          <p>
            Pools <span v-if="pools.length" class="text-red-600"> * </span>
          </p>
          <p>
            Team <span v-if="pools.length" class="text-red-600"> * </span>
          </p>
          <p>
            Internecine battles <span v-if="pools.length" class="text-red-600"> * </span>
          </p>
        </div>
        <template v-for="pool in pools">
          <div class="grid grid-cols-3 gap-4 mb-4">
            <TextInput v-model:value="pool.name" :required="true" placeholder="Name"/>
            <TextInput v-model:value="pool.teams_count" type="number" :required="true" placeholder="Teams count"
                       :min="0" :max="tournament.team_count"/>
            <TextInput v-model:value="pool.games_between" type="number" :required="true" placeholder="Games between"
                       :min="0"/>
          </div>
        </template>
      </div>
    </div>

    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-0">
        <TextInput v-model:value="tournament.cross_pool_game_count"
                   label="Matches Between Pools"
                   placeholder="Matches between pools"
                   type="number"
                   :min="0"
        />
        <TextInput v-model:value="tournament.cross_standing_group_game_count"
                   label="Intermatches Across Position Groups"
                   placeholder="Intermatches across position groups"
                   type="number"
                   :min="0"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <Select :options="roundTypes"
                v-model:value="roundType"
                label="Rounds"
                ref="roundTypesRef"
        />
        <Select :options="regions"
                v-model:value="region"
                label="Regions"
                ref="regionsRef"
        />
      </div>
      <p class="relative group text-nowrap w-fit mt-4">
        <template v-if="!rounds.length">
          <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block"
                      :class="!tournament.start_date || !tournament.end_date ? 'bg-brand-primary-color/20 hover:!bg-brand-primary-color/20' : ''"
                      :type="!tournament.start_date || !tournament.end_date ? 'submit' : 'button'"
                      @onClick="() => emitCalculateRounds()">
            Calculate Rounds
          </BaseButton>
          <template v-if="!tournament.start_date || !tournament.end_date">
          <span
              class="absolute bottom-full mb-1 text-xs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
            Start Date and End Date fields are required
          </span>
          </template>
        </template>
        <template v-else>
          <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block bg-red-600 -700"
                      type="button"
                      @onClick="() => emit('delete-rounds')">
            Delete Rounds
          </BaseButton>
        </template>
      </p>
      <div v-if="rounds.length" class="mt-3">
        <RoundsTable v-model:rounds="rounds"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import DatePicker from "~/components/datePicker/DatePicker.vue";
import Select from "~/components/inputs/Select.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import type Tournament from "~/interfaces/tournament/tournament";
import type Pools from "~/interfaces/pools/pools";
import {useTournamentProgramStore} from "~/store/tournamentPrograms";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import BaseButton from "~/components/buttons/BaseButton.vue";
import RoundsTable from "~/components/tables/RoundsTable.vue";
import type Rounds from "~/interfaces/rounds/rounds";
import {useRegionStore} from "~/store/region";
import {useUserStore} from "~/store/user";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import moment from "moment";

const props = defineProps({
  tournament: {
    type: Object as () => Tournament,
    required: true
  },
  pools: {
    type: Array as () => Array<Pools>,
    required: true
  },
  rounds: {
    type: Array as () => Array<Rounds>,
    required: true
  }
})

const emit = defineEmits(['update:tournament', 'update:pools', 'update:rounds', 'calculate-rounds', 'delete-rounds']);

const programsStore = useTournamentProgramStore()
const regionStore = useRegionStore()
const userStore = useUserStore()
const route = useRoute()
const tournamentGroupId = route.params.tournamentGroupId

const {fetchTournamentGroupById} = useTournamentGroupFetch()

const program = ref({} as SelectOptions)
const region = ref({} as SelectOptions)
const roundType = ref({} as SelectOptions)
const showStartDateCalendar = ref(false)
const showEndDateCalendar = ref(false)
const pools = ref([] as Array<Pools>)
const rounds = ref([] as Array<Rounds>)
const tournament = ref({} as Tournament)
const roundTypesRef = ref<InstanceType<typeof Select> | null>(null)
const regionsRef = ref<InstanceType<typeof Select> | null>(null)
const programSchemaRef = ref<InstanceType<typeof Select> | null>(null)
const tournamentGroup = ref({} as TournamentGroup)

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

watch(() => props.tournament, () => {
  tournament.value = JSON.parse(JSON.stringify(props.tournament))
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
  if (tournament.value.end_date && moment(tournament.value.end_date.toString()).isBefore(moment(tournament.value.start_date.toString()))) {
    tournament.value.end_date = ''
  }
}, {
  deep: true,
  immediate: true
})

watch(() => props.rounds, () => {
  rounds.value = JSON.parse(JSON.stringify(props.rounds))
}, {
  deep: true,
  immediate: true
})

watch(() => rounds.value, () => {
  if (JSON.stringify(rounds.value) !== JSON.stringify(props.rounds)) {
    emit('update:rounds', [...rounds.value])
  }
}, {
  deep: true,
  immediate: true
})

watch(() => pools.value, () => {
  if (JSON.stringify(pools.value) !== JSON.stringify(props.pools)) {
    emit('update:pools', [...pools.value])
  }
}, {
  deep: true,
  immediate: true
})

watch(() => props.pools, () => {
  pools.value = pools.value = JSON.parse(JSON.stringify(props.pools))
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
  } else if (+value === tournament.value.pools.length) {
    pools.value = JSON.parse(JSON.stringify(tournament.value.pools))
  } else {
    for (let i = pools.value.length; i < +value; i++) {
      if (tournament.value.pools[i]) {
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

function closeCalendars() {
  showStartDateCalendar.value = false
  showEndDateCalendar.value = false
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
  tournamentGroup.value = await fetchTournamentGroupById(+tournamentGroupId)
}

onMounted(() => {
  document.body.addEventListener('click', closeCalendars)
  fetchGroup()
})
</script>