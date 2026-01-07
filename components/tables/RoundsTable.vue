<template>
  <div>
    <div class="grid grid-cols-4 gap-4">
      <p class="text-center">Number</p>
      <p class="text-center">Year-week</p>
      <p class="text-center">Type</p>
      <p class="text-center">Not Playable</p>
    </div>
    <template v-for="round in rounds">
      <div class="grid grid-cols-4 hover:bg-gray-200 px-2 items-center rounded-sm gap-4 text-xs">
        <span class="text-center">
          {{round.number ? round.type === 2 ? `${round.number} + ${round.number + 1}` : round.number : "--"}}
        </span>
        <span class="text-center">
          {{round.year}} - {{round.week}}
        </span>
        <RoundTypeSelect
            :options="roundTypes"
            v-model:value="round.type"
        />
        <span class="text-center">
          <CheckBox v-model:value="round.deleted as boolean" :name="'round_'+round.id"/>
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type Rounds from "~/interfaces/rounds/rounds";
import CheckBox from "~/components/inputs/CheckBox.vue";
import RoundTypeSelect from "~/components/inputs/RoundTypeSelect.vue";

const props = defineProps({
  rounds: {
    type: Array as () => Rounds[],
    required: true
  }
})

const emit = defineEmits(['update:rounds'])

const rounds = ref([] as Array<Rounds>)
const roundTypes = ['weekend', 'tuesday-thursday', 'double']

watch(() => props.rounds, () => {
  if (!rounds.value.length || JSON.stringify(rounds.value) !== JSON.stringify(props.rounds)) {
    calculateRounds(props.rounds)
  }
}, {
  deep: true,
  immediate: true
})

watch(() => rounds.value, () => {
  if(JSON.stringify(rounds.value) !== JSON.stringify(props.rounds)) {
    calculateRounds(rounds.value)
    emit('update:rounds', JSON.parse(JSON.stringify(rounds.value)))
  }
}, {
  deep: true,
  immediate: true
})

function calculateRounds(roundsData: Rounds[]) {
  let index = 0
  rounds.value = roundsData.map(round => {
    if (!round.deleted) {
      const data = {...round, number: ++index}
      if (round.type === 2) {
        index++
      }
      return data
    } else {
      return {...round, number: 0}
    }
  })
}
</script>