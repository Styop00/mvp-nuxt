<template>
  <BaseModalComponent v-model:visible="modal" :width="5" name="_blocked_period">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold mb-5 border-b">
        {{ blockedPeriodId ? 'Update blocked period' : 'Create blocked period' }}
      </p>
      <form action="#"
            class="min-h-[60vh] flex flex-col justify-between"
            @submit.prevent="createOrUpdate">
        <div>
          <div class="flex flex-col gap-3">
            <div class="grid-cols-1 sm:grid-cols-2 grid gap-8">
              <TextInput v-model:value="title" label="Title" :required="true" placeholder="Title"/>
              <TextInput v-model:value="description" label="Description" placeholder="Description"/>
            </div>
            <div class="grid-cols-1 sm:grid-cols-2 grid gap-8">
              <div class="relative">
                <TextInput
                    :value="startDate ? startDate + ' - ' + endDate : ''"
                    placeholder="Date"
                    label="Period"
                    @click.prevent="() => showCalendar()"
                    :prevent-input="true"
                    :required="true"
                />
                <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow"
                     @click.stop
                     v-if="showRangeCalendar">
                  <RangePicker
                      @close="showRangeCalendar = false"
                      v-model:model-value="range"
                      color="blue"
                  />
                </div>
              </div>
              <div>
                <span class="font-inter-medium flex gap-1 text-sm">
                  Tournament Groups
                  <span class="text-red-600">
                    *
                  </span>
                </span>
                <SelectMultiple v-model:value="groups"
                             :options="tournamentGroups"
                             :multiple="true"
                             :close-on-select="false"
                             :clear-on-select="false"
                             placeholder="Select Tournament Groups"
                             label="name"
                             track-by="value"
                             :preselect-first="true"
                >
                  <template #selection="{ values, isOpen }">
                  <span class="multiselect__single"
                        v-if="values.length"
                        v-show="!isOpen">
                    {{ values.length }} options selected
                  </span>
                  </template>
                </SelectMultiple>
                <p v-if="groupError" class="text-red-600 font-bold p-1 text-xs">
                  {{ groupError }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 flex w-full flex-wrap items-center gap-4">
            <template v-for="(group, index) in groups">
              <div class="px-2 py-1 bg-gray-200 flex items-center gap-2 rounded-xl">
                <p class="text-sm">
                  {{ group.name }}
                </p>
                <font-awesome
                    :icon="['fas', 'xmark']"
                    @click="() => unSelect(index)"
                    class="text-gray-400 hover:text-black cursor-pointer"
                />
              </div>
            </template>
          </div>
        </div>
        <BaseButton class="!py-2 block my-5 mt-10 mx-auto">
          {{ blockedPeriodId ? 'Update' : 'Create' }}
        </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import RangePicker from "~/components/datePicker/RangePicker.vue";
import {useBlockedPeriodsFetch} from "~/composables/useBlockedPeriodsFetch/useBlockedPeriodsFetch";
import moment from "moment/moment";
import {useUserStore} from "~/store/user";
import Multiselect from 'vue-multiselect'
import SelectMultiple from "~/components/inputs/SelectMultiple.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  blockedPeriodId: {
    type: Number,
    default: 0
  },
  tournamentGroups: {
    type: Array<any>,
    default: 0
  }
})

const userStore = useUserStore()

const {fetchBlockedPeriodById, createBlockedPeriod, updateBlockedPeriod} = useBlockedPeriodsFetch()

const modal = ref(false)
const title = ref('')
const description = ref('')
const showRangeCalendar = ref(false)
const startDate = ref('')
const endDate = ref('')
const groups = ref([] as Array<{ name: string, value: number | null }>)
const groupError = ref('')

const emit = defineEmits([
  'update:visible',
  'update:blockedPeriodId',
  'reFetch'
])

watch(() => props.visible, async () => {
  if (!props.visible) {
    title.value = ''
    description.value = ''
    startDate.value = ''
    endDate.value = ''
    groups.value = [{
      name: 'All',
      value: null
    }]
    groupError.value = ''
  }

  if (props.blockedPeriodId) {
    await fetchPeriod()
  }
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:blockedPeriodId', 0)
    emit('update:visible', false)
  }
})

watch(groups, () => {
  if (groups.value.length > 1) {
    if (!groups.value[groups.value.length - 1].value) {
      groups.value = [groups.value[groups.value.length - 1]]
    } else if (groups.value.find(group => !group.value)) {
      groups.value.splice(0, 1)
    }
  }
}, {
  deep: true,
  immediate: true,
})

const range = computed({
  get: () => {
    return [startDate.value, endDate.value];
  },
  set: (value: Array<string>) => {
    startDate.value = moment(value[0]).format('YYYY-MM-DD')
    endDate.value = moment(value[1]).format('YYYY-MM-DD')
  }
})

const tournamentGroups = computed(() => {
  return [
    {
      name: 'All',
      value: null,
    },
      ...props.tournamentGroups
  ]
})

async function fetchPeriod() {
  const res = await fetchBlockedPeriodById(props.blockedPeriodId)

  title.value = res.title
  description.value = res.description
  startDate.value = res.startDate as string
  endDate.value = res.endDate as string
  if (res.blockAll) {
    groups.value.push({
      name: 'All',
      value: null
    })
  } else {
    const periodGroups = res.tournamentGroups.map(group => group.id)
    groups.value = tournamentGroups.value.filter(group => periodGroups.includes(group.value))
  }
}

async function createOrUpdate() {
  groupError.value = ''
  if (!groups.value.length) {
    groupError.value = 'Tournament group is required!'
    return
  }
  if (props.blockedPeriodId) {
    await updateBlockedPeriod(props.blockedPeriodId, {
      seasonSportId: userStore.seasonSportId,
      title: title.value,
      description: description.value,
      startDate: startDate.value,
      endDate: endDate.value,
      blockAll: !!groups.value.find(group => !group.value),
      groups: groups.value.filter(group => group.value).map(group => group.value)
    })
  } else {
    await createBlockedPeriod({
      seasonSportId: userStore.seasonSportId,
      title: title.value,
      description: description.value,
      startDate: startDate.value,
      endDate: endDate.value,
      blockAll: !!groups.value.find(group => !group.value),
      groups: groups.value.filter(group => group.value).map(group => group.value)
    })
  }
  emit('reFetch')
  modal.value = false
}

function closeDropdowns() {
  showRangeCalendar.value = false
}

function showCalendar() {
  setTimeout(() => showRangeCalendar.value = true)
}

function unSelect(index) {
  groups.value.splice(index, 1)
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_blocked_period')
  if (modal) {
    modal.addEventListener('click', () => closeDropdowns())
  }
})
</script>
