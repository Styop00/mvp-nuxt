<template>
  <div class="md:p-6 w-full ">
    <form @submit.prevent.stop class="space-y-6 w-full">
      <p
        v-if="isShowFileInput"
        class="text-base font-bold pb-4 flex items-center justify-start tracking-widest"
      >
        <span
          class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-red-500/50 to-pink-500/50 mr-3"
        />
        Import/Register Course
      </p>

      <div class="flex w-full gap-6 md:flex-nowrap flex-wrap">
        <Select
          label="Module Name"
          v-model:value="moduleName"
          :options="moduleOptions"
          class=""
          required
          ref="clubSelect"
        />

        <div class="w-full relative calendar ">
          <TextInput
            v-model:value="course.date"
            label="Date"
            placeholder="Date"
            @click.stop.prevent="() => { closeSelects(); showDateCalendar = true}"
            :prevent-input="true"
            :required="true"
          />
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
            @click.stop
            v-if="showDateCalendar"
            style="z-index: 99999 !important; position: absolute !important;"
          >
            <DatePicker v-model:model-value="course.date" color="blue" />
          </div>
        </div>

        <div class="w-full w-1/3">
          <TextInput
            label="Hours"
            v-model:value="course.hours"
            placeholder="Enter hours"
            type="number"
            min="0"
            :class="hoursError ? '!border-red-500' : ''"
            required
          />
          <p v-if="hoursError" class="text-red-700 text-xs mt-1">
            {{ hoursError }}
          </p>
        </div>
      </div>

      <div v-if="!course.id" class="flex gap-[100px] ">
        <div>
          License
          <span class="text-red-600"> * </span>
        </div>
        <dive class="flex flex-col gap-1">
          <div class="flex gap-12">
            <CheckBox v-model:value="course.licenseM" label="M" name="M" />
            <CheckBox v-model:value="course.licenseB" label="B" name="B" />
            <CheckBox v-model:value="course.licenseT" label="T" name="T" />
          </div>

          <p v-if="licenseErrorMessage" class="text-red-600 text-xs ">
            {{ licenseErrorMessage }}
          </p>
        </dive>
      </div>

      <TextArea v-model:value="course.comment" label="Comment" class="" />

      <div v-if="props.isShowFileInput">
        <span class="text-red-600"> * </span>
        <input type="file" id="input" multiple @change="readFile" />
        <p v-if="fileExtensionError" class="text-red-700 text-xs mt-1">
          {{ fileExtensionError }}
        </p>
      </div>

      <div
        v-if="coaches.length > 0"
        id="divImport"
        class="mt-6 w-full md:w-1/2"
      >
        <table class="table-auto w-full border border border-dark-border-default">
          <thead>
            <tr>
              <th class="text-start border px-4 py-2 text-xs">Name</th>
              <th class="text-start border px-4 py-2 text-xs">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in coaches" :key="rowIndex">
              <td class="border px-4 py-2 text-xs whitespace-nowrap break-all">
                {{ row.name }}
              </td>
              <td class="border px-4 py-2 text-xs whitespace-nowrap break-all">
                {{ row.email }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="requiredFieldsErrorMessage" class="text-red-700 text-xs mt-1">
        {{ requiredFieldsErrorMessage }}
      </p>

      <div class="flex justify-start mt-4">
        <BaseButton
          @on-click="saveCourses"
          type="button"
          class="text-white font-bold py-2 px-4 rounded"
          :class="loadingbutton ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
    </form>
    <SuccessAlert
      v-model:visible="showSuccessAlertCreate"
      text="Courses has been successfully imported."
    />
  </div>
</template>

<script setup lang="ts">
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import Select from '../inputs/Select.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import DatePicker from '../datePicker/DatePicker.vue';
import { debounce } from '~/utils/debounce';
import CheckBox from '../inputs/CheckBox.vue';
import TextArea from "~/components/inputs/TextArea.vue";
import { useCoachEducationFetch } from "~/composables/useCoachEducationFetch/useCoachEducationFetch"
import type CoachEducation from '~/interfaces/coachEducation/coachEducation';
import moduleOptions from '~/interfaces/coaches/coachmoduleData';

const showSuccessAlertCreate = ref(false)
const moduleName = ref({} as SelectOptions)
const showDateCalendar = ref(false)
const course = ref({} as CoachEducation);
const hoursError = ref('');
const loadingbutton = ref(false)
const requiredFieldsErrorMessage = ref("")
const licenseErrorMessage = ref('');
const coaches = ref([]);
const clubSelect = ref<InstanceType<typeof Select> | null>(null)


const emit = defineEmits([ 'refreshData']);

const { createCoursesOrCoachEducation } = useCoachEducationFetch()

function validateHours(newVal: number) {
  if (newVal < 0) {
    hoursError.value = 'Please enter a positive number for hours.';
    return false;
  } else {
    hoursError.value = '';
    return true;
  }
}

const props = defineProps<{
  isShowFileInput: boolean;
  course: CoachEducation;
  coachId: Number;
}>();

watch(() => props.course, (newVal) => {
  if (newVal) {
    moduleName.value = {
      label: newVal.module || '',
      value: newVal.module || '',
      disabled: false
    };

    course.value = {...props.course}
  }
}, { immediate: true });

watch(moduleName, (newVal) => {
  if (newVal && newVal.label && newVal.value) {
    requiredFieldsErrorMessage.value = '';
  }
});

watch(() => course.value.date, (newVal) => {
  if (newVal) {
    requiredFieldsErrorMessage.value = '';
  }
});

watch(coaches, (newVal) => {
  if (newVal.length > 0) {
    requiredFieldsErrorMessage.value = '';
  }
});

watch([course.value.licenseM, course.value.licenseB, course.value.licenseT], ([newLicenseM, newLicenseB, newLicenseT]) => {
  if (newLicenseM || newLicenseB || newLicenseT) {
    licenseErrorMessage.value = '';
    requiredFieldsErrorMessage.value = '';
  }
});

watch(() => course.value.hours, debounce((newValue: number) => {
  if(newValue) {
    requiredFieldsErrorMessage.value = '';
    validateHours(newValue);
  }

}, 500));

function closeSelects() {
  if (clubSelect.value) {
    clubSelect.value.closeDropdown()
  }
  showDateCalendar.value = false
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_coach_courses')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
  document.addEventListener('click', () => closeSelects())
});

function resetForm() {
  moduleName.value = {label: '', value: '', disabled: false};
  course.value = {} as CoachEducation;
  coaches.value = [];
  fileExtensionError.value = "";
}

const fileExtensionError = ref("")
function readFile(event: Event) {
  fileExtensionError.value = ""
  const inputElement = event.target as HTMLInputElement;
  const files = inputElement.files;

  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();


  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!['csv', 'txt'].includes(fileExtension || '')) {
    fileExtensionError.value = 'Please upload a valid CSV or TXT file.'
    return;
  }

  reader.onload = (e) => {
    const result = e.target?.result as string;

    const rows = result.split('\n').map(row => row.trim());

    const parsedData = rows.map(row => {
      const [name, email] = row.split(';');
      return { name: name?.trim() || '', email: email?.trim() || '' };
    });

    coaches.value = parsedData.filter(row => row.name && row.email);
  };


    reader.readAsText(file);
  }
}

async function saveCourses() {
  loadingbutton.value = true;
  requiredFieldsErrorMessage.value = '';

  if (props.coachId) {
    course.value.coachId = props.coachId as number;

    if (!course.value.id) {
      if (!moduleName.value || !course.value.hours || !course.value.date || !(course.value.licenseB || course.value.licenseM || course.value.licenseT)) {
        requiredFieldsErrorMessage.value = "Please fill in all required fields for course creation.";
        loadingbutton.value = false;
        return;
      }
    } else {
      if (!moduleName.value || !course.value.hours || !course.value.date) {
        requiredFieldsErrorMessage.value = "Please fill in all required fields for course update.";
        loadingbutton.value = false;
        return;
      }
    }
  } else {
    if (
      !moduleName.value ||
      !(course.value.licenseB || course.value.licenseM || course.value.licenseT) ||
      !course.value.hours ||
      !course.value.date ||
      coaches.value.length === 0
    ) {
      requiredFieldsErrorMessage.value = "Please fill in all required fields, including coaches.";
      loadingbutton.value = false;
      return;
    }
  }

  const coachesObject = coaches.value.reduce((acc, coach, index) => {
    acc[index] = coach;
    return acc;
  }, {});

  const body: CoachEducation = {
    ...course.value,
    module: moduleName.value.value as string,
    educationId: course.value.id,
    coachId: course.value.coachId,
    coaches: coachesObject,
  };

  const response = await createCoursesOrCoachEducation(body);

  if (response === "success") {
    if(props.isShowFileInput) {
      showSuccessAlertCreate.value = true;
      setTimeout(() => {
        emit('refreshData')
        resetForm();
        navigateTo('/coaches/coaches');
      }, 2000);
      return
    }

    
    emit('refreshData')
  } else {
    loadingbutton.value = false;
  }
}
</script>
