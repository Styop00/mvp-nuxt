<template>
  <div class="grid grid-cols-1 items-center justify-center gap-4 w-full">
    <p class="font-bold mb-5 border-b pb-1">
      Create player for team
    </p>
    <div>
      <TextInput
          placeholder="Type user full name"
          v-model:value="name"
          label="Full name of player"
          :required="true"
      />
      <p v-if="error.type === 'name'" class="text-red-600 font-bold p-1 text-xs">
        {{ error.message }}
      </p>
    </div>
    <div class="w-full">
      <p class="font-inter-medium text-sm">
        Team
        <span class="text-red-600">
          *
        </span>
      </p>
      <FilterSelect
          :options="teams"
          v-model:value="selectedTeam"
          class="!w-full"
      />
      <p v-if="error.type === 'team'" class="text-red-600 font-bold p-1 text-xs">
        {{ error.message }}
      </p>
    </div>
    <div>
      <TextInput
          v-model:value="email"
          label="Email"
          type="email"
          placeholder="Type user email"
          :required="true"
      />
      <p v-if="error.type === 'email'" class="text-red-600 font-bold p-1 text-xs">
        {{ error.message }}
      </p>
    </div>
    <div>
      <TextInput
          v-model:value="jerseyNumber"
          label="Possible number on player shirt"
          placeholder="Type user number"
          type="number"
          :required="true"
      />
      <p v-if="error.type === 'number'" class="text-red-600 font-bold p-1 text-xs">
        {{ error.message }}
      </p>
    </div>
    <div class="w-full flex items-center justify-center gap-8">
      <BaseButton
          class="!px-6 !py-3"
          @click="confirm"
      >
        Create
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from "~/components/inputs/TextInput.vue";
import {ref} from "vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import FilterSelect from "~/components/inputs/FilterSelect.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useUserStore} from "~/store/user";

const props = defineProps({
  clubId: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['formClose', 'added'])

const {fetchTeamNames, addUserToTeam} = useTeamsFetch()
const userStore = useUserStore()
const name = ref('')
const email = ref('')
const error = ref({
  type: '',
  message: '',
})
const jerseyNumber = ref<number>()
const teams = ref([] as SelectOptions[])
const selectedTeam = ref({
  label: '---select---',
  value: null,
  disabled: false
} as SelectOptions)

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
})

async function fetchTeams() {
  const res = await fetchTeamNames('tournamentName', 'asc', {
    clubId: props.clubId,
  });

  teams.value = res.map((team) => {
    return {
      label: team.localName,
      value: team.id,
      disabled: false
    } as SelectOptions
  })

  teams.value.unshift({
    label: '---select---',
    value: null,
    disabled: false
  })
}

async function confirm() {
  error.value = {
    type: '',
    message: '',
  }
  if (!name.value) {
    error.value = {
      message: "Name is required",
      type: 'name'
    };
  } else if (!selectedTeam.value?.value) {
    error.value = {
      message: "Team is required",
      type: 'team'
    };
  } else if (!email.value) {
    error.value = {
      message: "Email is required",
      type: 'email'
    };
  } else if (!isValidEmail.value) {
    error.value = {
      message: "Email is not valid.",
      type: 'email'
    };
    return
  } else if (!jerseyNumber.value) {
    error.value = {
      message: "Number is required",
      type: 'number'
    };
  }

  if (error.value.type) return

  await addUserToTeam(+selectedTeam.value?.value, {
    email: email.value,
    number: jerseyNumber.value,
    name: name.value,
    seasonSportId: userStore.seasonSportId
  })

  emit('added')
}

fetchTeams()

</script>