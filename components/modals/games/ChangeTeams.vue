<template>
  <BaseModalComponent v-model:visible="modal" :width="4" :title="`Correct teams at match #${game.number}`">
    <div class="p-4">
      <div class="min-h-[70vh] flex flex-col justify-between ">
        <div>
          <Select :options="teams" v-model:value="teamHome"/>
          <p class="my-2">
            Against
          </p>
          <Select :options="teams" v-model:value="teamAway"/>
          <template v-if="error">
            <p class="text-red-500 text-sm">
              {{error}}
            </p>
          </template>
        </div>
        <div class="flex gap-6 items-center justify-center mt-6">
          <BaseButton class="text-white font-bold py-2 px-4 rounded-xl" @onClick="() => modal=false">
            Cancel
          </BaseButton>
          <BaseButton
              class="text-white font-bold py-2 px-4 rounded-xl"
              @onClick="saveChanges">
            Save
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type {PropType} from "vue";
import type Game from "~/interfaces/games/game";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  game: {
    type: Object as PropType<Game>,
    required: true,
  }
})

const emit = defineEmits([
  'update:visible',
  'update:game',
  'reFetch'
])

const teams = ref([] as SelectOptions[])
const teamHome = ref({} as SelectOptions)
const teamAway = ref({} as SelectOptions)
const modal = ref(false)
const error = ref('')

const {fetchTournamentById} = useTournamentFetch()
const {updateGame} = useGamesFetch()

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

watch(() => props.game, () => {
  if (props.game?.id) {
    fetchTeams()
  }
})

async function fetchTeams() {
  teams.value = [];
  const res = await fetchTournamentById(props.game?.tournament_id ? props.game?.tournament_id : 0)
  res?.teams?.forEach(team => {
    teams.value.push({
      label: team.tournament_name ? team.tournament_name : team.local_name,
      value: team.id,
      disabled: false
    })
  })

  teamHome.value = teams.value.find(team => team.value === props.game?.team_id_home) as SelectOptions
  teamAway.value = teams.value.find(team => team.value === props.game?.team_id_away) as SelectOptions
}

async function saveChanges() {
  if (teamHome.value === teamAway.value) {
    error.value = 'Please select different teams.'
    return
  }
  error.value = ''

  const res = await updateGame(props.game.id, {
    teamIdHome: teamHome.value.value,
    teamIdAway: teamAway.value.value,
  })

  if (res) {
    emit('update:visible', false)
    emit('update:game', {})
    emit('reFetch')
  }

}
</script>
