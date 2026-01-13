<template>
  <BaseModalComponent v-model:visible="modal" :width="3" title="Add new role for the user">
    <div class="p-4">
      <div class="min-h-96">
        <div class="grid grid-cols-1 items-center justify-center ">
          <div class="mb-4 mx-auto w-full">
            <p class="font-inter-medium text-sm">
              Role
              <span
                    class="text-red-600"
              >
                *
              </span>
            </p>
            <FilterSelect
                :options="roles"
                v-model:value="selectedRole"
                class="!w-full"
            />
            <p v-if="roleError" class="text-red-700 text-xs mt-1 pl-1">
              {{ roleError }}
            </p>
          </div>
          <div class="mb-4 mx-auto w-full" v-if="showTeamSelect">
            <p class="font-inter-medium text-sm">
              Team
              <span
                    class="text-red-600"
              >
                *
              </span>
            </p>
            <FilterSelect
                :options="teams"
                v-model:value="selectedTeam"
                class="!w-full"
            />
            <p v-if="teamError" class="text-red-700 text-xs mt-1 pl-1">
              {{ teamError }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <BaseButton
            class="!px-6"
            @click="confirmAction">
          Confirm
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import {useRoleStore} from "~/store/role";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import FilterSelect from "~/components/inputs/FilterSelect.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import type Clubs from "~/interfaces/clubs/club";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  clubId: {
    type: Number,
    required: true,
  }
});

const {fetchTeamNames} = useTeamsFetch()
const {fetchClubById} = useClubsFetch()
const rolesStore = useRoleStore()
const selectedRole = ref({
  label: '---select---',
  value: null,
  disabled: false,
} as SelectOptions)
const teams = ref([] as SelectOptions[])
const selectedTeam = ref({
  label: '---select---',
  value: null,
  disabled: false
} as SelectOptions)
const modal = ref(false);
const roleError = ref('')
const teamError = ref('')
const club= ref({} as Clubs)

const emit = defineEmits(['update:visible', 'updateRoles']);

const roles = computed(() => {
  const allRoles = rolesStore.roles.filter((role) => role.id <= 11).map((role) => {
    return {
      label: role.description,
      value: role.id,
      disabled: false
    } as SelectOptions
  });

  allRoles.unshift({
    label: '---select---',
    value: null,
    disabled: false
  })
  return allRoles;
})

const showTeamSelect = computed(() => {
  return !selectedRole.value.value || (+selectedRole.value.value >= 2 && +selectedRole.value.value <= 10 && selectedRole.value?.value != 4)
})

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    roleError.value = '';
    teamError.value = '';
    selectedRole.value = roles.value[0];
    selectedTeam.value = teams.value[0];
    emit('update:visible', false);
  }
});

function confirmAction() {
  roleError.value = ''
  teamError.value = ''
  if (!selectedRole.value.value) {
    roleError.value = 'Role is required.'
    return
  }

  if (!selectedTeam.value.value && showTeamSelect.value) {
    teamError.value = 'Team is required.'
    return
  }
  emit('updateRoles', {
    roleId: selectedRole.value.value,
    teamName: showTeamSelect.value && selectedTeam.value.value ? selectedTeam.value.label : club.value.name,
    teamId: selectedTeam.value.value
  });
  selectedRole.value = roles.value[0];
  selectedTeam.value = teams.value[0];
  modal.value = false;
}

function cancelAction() {
  modal.value = false;
}

async function fetchTeams() {
  const res = await fetchTeamNames('tournamentName', 'asc', {
    clubId: props.clubId,
  });

  teams.value = res.map((team) => {
    return {
      label: team.localName ? team.localName : team.tournamentName,
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

async function fetchClub() {
  const res = await fetchClubById(props.clubId);

  club.value = res
}

onMounted(() => {
  fetchTeams();
  fetchClub()
})
</script>
