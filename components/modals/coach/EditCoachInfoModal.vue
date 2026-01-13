<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_coach_edit" title="Edit Master Data">
    <div class="pb-4">
      <div class="flex flex-col gap-4 m-6">
        <Select
          label="Module Name"
          v-model:value="moduleName"
          :options="moduleOptions"
          class=""
          ref="clubSelect"
        />
        <div class="flex gap-2 flex-col">
          <TextInput
            v-model:value="children"
            type="text"
            label="Old license numbers (separate with commas)"
            placeholder="License numbers "
            class="w-full"
          />
          <p v-if="childrenError" class="text-red-700 text-xs mt-1">
            {{ childrenError }}
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex gap-4">
            <div class="w-full relative calendar">
              <TextInput
                v-model:value="coach.start"
                label="License Start"
                placeholder="License Start"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarStart = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('coachStart')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                @click.stop
                v-if="showDateCalendarStart"
                style="z-index: 99999 !important; position: absolute !important;"
              >
                <DatePicker v-model:model-value="coach.start" color="blue" />
              </div>
            </div>

            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="coach.end"
                label="License End"
                placeholder="License End"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarEnd = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('coachEnd')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarEnd"
              >
                <DatePicker v-model:model-value="coach.end" color="blue" />
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="mLicenseStart"
                label="M License Start"
                placeholder="M License Start"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarMStart = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('mLicenseStart')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarMStart"
              >
                <DatePicker v-model:model-value="mLicenseStart" color="blue" />
              </div>
            </div>

            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="mLicenseEnd"
                label="M License End"
                placeholder="M License End"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarMEnd = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('mLicenseEnd')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarMEnd"
              >
                <DatePicker v-model:model-value="mLicenseEnd" color="blue" />
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="bLicenseStart"
                label="B License Start"
                placeholder="B License Start"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarBStart = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('bLicenseStart')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                @click.stop
                v-if="showDateCalendarBStart"
                style="z-index: 99999 !important; position: absolute !important;"
              >
                <DatePicker v-model:model-value="bLicenseStart" color="blue" />
              </div>
            </div>

            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="bLicenseEnd"
                label="B License End"
                placeholder="B License End"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarBEnd = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('bLicenseEnd')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarBEnd"
              >
                <DatePicker v-model:model-value="bLicenseEnd" color="blue" />
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="tLicenseStart"
                label="T License Start"
                placeholder="T License Start"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarTStart = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('tLicenseStart')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarTStart"
              >
                <DatePicker v-model:model-value="tLicenseStart" color="blue" />
              </div>
            </div>

            <div class="w-full relative calendar ">
              <TextInput
                v-model:value="tLicenseEnd"
                label="T License End"
                placeholder="T License End"
                @click.stop.prevent="() => { closeSelects(); showDateCalendarTEnd = true}"
                :prevent-input="true"
              />
              <button
                @click.stop.prevent="clearField('tLicenseEnd')"
                class="absolute right-3 top-2/3 transform -translate-y-1/2  text-[10px] text-red-500 hover:text-red-700"
              >
                <font-awesome :icon="['fas', 'x']" />
              </button>
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                @click.stop
                v-if="showDateCalendarTEnd"
              >
                <DatePicker v-model:model-value="tLicenseEnd" color="blue" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-10 mr-6">
        <BaseButton
          @on-click="saveEditCoachInfo"
          type="button"
          class="text-white font-bold py-2 px-4 rounded"
          :class="loadingbutton ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import Select from '~/components/inputs/Select.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import moduleOptions from '~/interfaces/coaches/coachmoduleData';
import TextInput from '~/components/inputs/TextInput.vue';
import { useCoachesFetch } from '~/composables/useCoachesFetch/useCoachesFetch';
import type Coach from '~/interfaces/coaches/coach';
import type { CoachLicense } from '~/interfaces/coaches/coach';
import DatePicker from '~/components/datePicker/DatePicker.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import type CoachInfoDto from '~/interfaces/coaches/coachInfoData'

const props = defineProps({
  visible: Boolean,
  coachId: Number
});

const emit = defineEmits(['update:visible', 'refreshData']);

const modal = ref(props.visible);
const moduleName = ref({} as SelectOptions)
const coach = ref({} as Coach)
const mLicenseStart = ref<string>("");
const mLicenseEnd = ref<string>("");
const bLicenseStart = ref<string | null>(null);
const bLicenseEnd = ref<string | null>(null);
const tLicenseStart = ref<string | null>(null);
const tLicenseEnd = ref<string | null>(null);
const children = ref("")
const showDateCalendarStart = ref(false)
const showDateCalendarEnd = ref(false)
const showDateCalendarMStart = ref(false)
const showDateCalendarMEnd = ref(false)
const showDateCalendarBStart = ref(false)
const showDateCalendarBEnd = ref(false)
const showDateCalendarTStart = ref(false)
const showDateCalendarTEnd = ref(false)
const loadingbutton = ref(false)
const childrenError = ref("")

const clubSelect = ref<InstanceType<typeof Select> | null>(null)


function closeSelects() {
  if (clubSelect.value) {
    clubSelect.value.closeDropdown()
  }
  showDateCalendarStart.value = false;
  showDateCalendarEnd.value = false;
  showDateCalendarMStart.value = false;
  showDateCalendarMEnd.value = false;
  showDateCalendarBStart.value = false;
  showDateCalendarBEnd.value = false;
  showDateCalendarTStart.value = false;
  showDateCalendarTEnd.value = false;
}

const { fetchCoachById, editCoachInfo } = useCoachesFetch()

async function fetchCoach(id: number) {
  const response = await fetchCoachById(id);
  if (response) {
    coach.value = response as Coach;
    findLatestLicenseByType(coach.value.coachLicenses)
  }
}

function findLatestLicenseByType(licenses: Partial<CoachLicense>[]) {
  licenses.forEach((license) => {
    switch (license.coachLicenseTypeId) {
      case 1:
        mLicenseStart.value = license.start || null;
        mLicenseEnd.value = license.end || null;
        break;
      case 2:
        bLicenseStart.value = license.start || null;
        bLicenseEnd.value = license.end || null;
        break;
      case 3:
        tLicenseStart.value = license.start || null;
        tLicenseEnd.value = license.end || null;
        break;
    }
  });
}

function clearField(fieldName: string) {
  switch (fieldName) {
    case 'coachStart':
      coach.value.start = "";
      break;
    case 'coachEnd':
      coach.value.end = "";
      break;
    case 'mLicenseStart':
      mLicenseStart.value = "";
      break;
    case 'mLicenseEnd':
      mLicenseEnd.value = "";
      break;
    case 'bLicenseStart':
      bLicenseStart.value = "";
      break;
    case 'bLicenseEnd':
      bLicenseEnd.value = "";
      break;
    case 'tLicenseStart':
      tLicenseStart.value = "";
      break;
    case 'tLicenseEnd':
      tLicenseEnd.value = "";
      break;
  }
}


function resetForm() {
  coach.value = {} as Coach;
  children.value = ""
  childrenError.value = ""
  mLicenseStart.value = "";
  mLicenseEnd.value = "";
  bLicenseStart.value = "";
  bLicenseEnd.value = "";
  tLicenseStart.value = "";
  tLicenseEnd.value = "";
  moduleName.value = { label: '', value: '', disabled: false };
}

function closeModal() {
  resetForm();
  modal.value = false;
}

async function saveEditCoachInfo() {
  childrenError.value = ""
  const body: CoachInfoDto = {
    level: moduleName.value.value as string,
    start: coach.value.start,
    end: coach.value.end,
    startm: mLicenseStart.value,
    endm: mLicenseEnd.value,
    startb: bLicenseStart.value,
    endb: bLicenseEnd.value,
    startt: tLicenseStart.value,
    endt: tLicenseEnd.value,
    children: children.value,
    coachId: props.coachId as number
  }
  const response = await editCoachInfo(body)

  if (response.message === "success" && response.failedChildren.length > 0) {
    const failedLicenses = response.failedChildren.join(', ');
    childrenError.value = response.failedChildren.length === 1
        ? `The following license does not exist and could not be added: ${failedLicenses}. Master license addition did not happen.`
        : `The following licenses do not exist and could not be added: ${failedLicenses}. Master license addition did not happen.`;
  } else if (response.message === "success") {
    closeModal()
    emit("refreshData")
  }
}

watch(() => props.visible, () => {
  modal.value = props.visible;
  if(props.coachId && props.visible) {
    fetchCoach(props.coachId as number);
    }
});

watch(() => modal.value, (newVal) => {
  if (!newVal) {
    closeModal();
    emit('update:visible', false);
  }
});

onMounted(() => {
  const modal = document.querySelector('#modal-body_coach_edit')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
  document.addEventListener('click', () => closeSelects())
});
</script>
