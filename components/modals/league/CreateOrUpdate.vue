<template>
  <BaseModalComponent v-model:visible="modal" :width="5">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold mb-5 border-b">
        {{ id ? 'Update a league' : 'Create a new league' }}
      </p>
      <form action="#" @submit.prevent="createOrUpdate">
        <div class="grid-cols-2 grid gap-8">
          <TextInput v-model:value="name" label="Name" :required="true" placeholder="Name"/>
          <Select v-model:value="organizer"
                  label="Organizer"
                  :options="organizers"/>
          <div class="relative">
            <TextInput
                v-model:value="startDate"
                label="Start Date"
                placeholder="Start Date"
                @click.stop.prevent="() => {closeDropdowns(); showStartDateCalendar = true}"
                :prevent-input="true"
                :required="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showStartDateCalendar"
                 style="z-index: 99999 !important; position: absolute !important;">
              <DatePicker v-model:model-value="startDate" color="blue"/>
            </div>
          </div>
          <div class="relative">
            <TextInput
                v-model:value="endDate"
                label="Finish Date"
                placeholder="Finish Date"
                @click.stop.prevent="() => {closeDropdowns(); showEndDateCalendar = true}"
                :prevent-input="true"
                :required="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showEndDateCalendar"
                 style="z-index: 99999 !important; position: absolute !important;">
              <DatePicker v-model:model-value="endDate" color="blue" :min-date="startDate"/>
            </div>
          </div>
        </div>
        <TextArea v-model:value="information" label="Public Information" class="mt-8" :required="false"/>
        <template v-if="userStore.isAdmin">
          <CheckBox
              v-model:value="isActive"
              label="Active (visible to others)"
              name="visible_to_others"
              class="mt-4"/>
        </template>
        <BaseButton class="!py-2 block my-5 mt-10 mx-auto">
          {{ id ? 'Update' : 'Create' }}
        </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import Select from "~/components/inputs/Select.vue";
import TextArea from "~/components/inputs/TextArea.vue";
import {useUserStore} from "~/store/user";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import moment from "moment";
import CheckBox from "~/components/inputs/CheckBox.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
  information: {
    type: String,
    default: '',
  },
  id: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const userStore = useUserStore()
const {fetchAllClubs} = useClubsFetch()

const modal = ref(false)
const showStartDateCalendar = ref(false)
const showEndDateCalendar = ref(false)
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const information = ref('')
const organizer = ref({
  value: '',
  label: '',
  disabled: false
})
const organizers = ref([] as Array<SelectOptions>)
const isActive = ref(false)

const emit = defineEmits([
  'update:visible',
  'reFetch'
])

watch(() => startDate.value, () => {
  if (endDate.value && moment(endDate.value.toString()).isBefore(moment(startDate.value?.toString()))) {
    endDate.value = ''
  }
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.addEventListener('click', closeDropdowns)
  }
})

async function getOrganizers() {
  if (userStore.isAdmin) {
    organizers.value = [{
      label: 'federation',
      value: null,
      disabled: false
    }]
  } else {
    const user_roles = userStore.user.user_roles.filter((role: any) => [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(role.roleId))
    const clubIds = user_roles.map((userRole: any) => userRole.clubId)

    if (clubIds.length) {
      const res = await fetchAllClubs({clubIds: clubIds})

      if (res) {
        organizers.value = res.map((club) => {
          return {
            label: club.name,
            value: club.id,
            disabled: false
          }
        })
      }
    }
  }
}

function closeDropdowns() {
  showStartDateCalendar.value = false
  showEndDateCalendar.value = false
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.click()
  }
}

watch(() => props.visible, async () => {
  if (props.visible) {
    await getOrganizers()
  }
  modal.value = props.visible
})

watch(() => props.id, () => {
  if (props.id) {
    name.value = props.name
    startDate.value = props.startDate
    endDate.value = props.endDate
    information.value = props.information
    isActive.value = props.isActive
  }
}, {
  deep: true,
  immediate: true
})

watch(() => modal.value, () => {
  if (!modal.value) {
    resetModal()
    emit('update:visible', false)
  }
})

function resetModal() {
  name.value = '';
  information.value = '';
  startDate.value = '';
  endDate.value = '';
  organizers.value = [];
  isActive.value = false
}

async function createOrUpdate() {
  if (props.id) {
    const response = await useApiV5Fetch(`leagues/${props.id}`, {
      method: 'PUT',
      body: {
        name: name.value,
        start_date: moment(startDate.value).format("YYYY-MM-DD"),
        end_date: moment(endDate.value).format("YYYY-MM-DD"),
        information: information.value,
        club_id: organizer.value.value,
        is_active: isActive.value
      }
    })

    if (response.data.value) {
      emit('reFetch')
    }
  } else {
    const response = await useApiV5Fetch('leagues', {
      method: 'POST',
      body: {
        name: name.value,
        start_date: moment(startDate.value).format("YYYY-MM-DD"),
        end_date: moment(endDate.value).format("YYYY-MM-DD"),
        information: information.value,
        season_sport_id: userStore.seasonSportId,
        club_id: organizer.value.value,
        is_active: isActive.value,
      }
    })

    if (response.data.value) {
      emit('reFetch')
    }
  }
}

</script>
