<template>
  <div class="md:p-6">
    <form @submit.prevent="saveUser" class="w-full">
      <div
        :class="['flex', 'flex-col', 'flex-wrap', 'mb-2', { 'opacity-50 pointer-events-none': props.userId }]"
      >
        <TextInput
          label="Email"
          v-model:value="user.email"
          :placeholder="user.email"
          type="email"
          :readonly="props.userId"
          class="md:w-1/2 w-full mb-1"
          required
        />
        <p v-if="emailError" class="text-red-700 text-xs">
          {{ emailError }}
        </p>
      </div>

      <CheckBox
        v-if="props.userId"
        v-model:value="(user.disableEmails as boolean)"
        label="Disable Emails"
        :style="{ display: props.showDisableEmails ? 'block' : 'none' } "
        class="mb-4"
      />

      <div class="flex sm:flex-nowrap flex-wrap gap-4 w-full mb-3">
        <TextInput
          label="Name"
          v-model:value="user.name"
          placeholder="Name"
          type="text"
          class="w-full"
          required
        />
        <TextInput
          label="License"
          v-model:value="user.license"
          placeholder="License"
          type="text"
          class="w-full "
        />
      </div>

      <div class="flex sm:flex-nowrap flex-wrap gap-4 mb-3">
        <TextInput
          label="Birth Year"
          v-model:value="user.birthYear"
          placeholder="Birth Year"
          type="number"
          class="w-full"
          :min="1900"
          :max="currentYear"
        />
        <Select
          label="Birth Month"
          v-model:value="birthMonthValue"
          :options="monthOptions"
          class="w-full"
        />

        <TextInput
          label="Birth Day"
          v-model:value="user.birthDay"
          placeholder="Birth Day"
          type="number"
          class="w-full"
          :min="1"
          :max="31"
        />
      </div>
      <p v-if="dateValidationError" class="text-red-700 text-xs mb-3">
        {{ dateValidationError }}
      </p>
      <div class="flex sm:flex-nowrap flex-wrap gap-4 w-full mb-3">
        <Select
          v-model:value="genderValue"
          :options="genderGroup"
          label="Gender"
          class="w-full"
        />
        <Select
          v-model:value="nationalityValue"
          :options="nationalityGroup"
          label="Nationality"
          class="w-full"
        />
      </div>
      <SuccessAlert
        v-model:visible="showSuccessAlertCreate"
        text="The new User has been successfully created."
      />
      <SuccessAlert
        v-model:visible="showSuccessAlertUpdate"
        text="User has been successfully updated."
      />
      <div class="flex justify-start mt-4">
        <BaseButton
          class="text-white font-bold py-2 px-4 rounded"
          :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Save
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useApiV5Fetch } from '~/composables/useApiV5Fetch';
import type User from '~/interfaces/users/users';
import TextInput from '../inputs/TextInput.vue';
import Select from '../inputs/Select.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useUsersFetch } from '~/composables/useUsersFetch/useUsersFetch';
import CheckBox from '../inputs/CheckBox.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import moment from 'moment';
import { useUserStore } from '~/store/user';

const loading = ref(false)

const daysPerMonth: { [key: number]: number }  = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

const monthOptions: SelectOptions[] = Array.from({ length: 12 }, (_, i) => ({
  label: moment.months()[i],
  value: i + 1,
  disabled: false
}));

const currentYear = new Date().getFullYear();

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const userStore = useUserStore()

const isValidDate = computed(() => {
  const year = user.value.birthYear;
  const month = birthMonthValue.value.value;
  const day = user.value.birthDay;

  if (year && month && day) {
    const maxDays = Number(month) === 2 && isLeapYear(Number(year)) ? 29 : daysPerMonth[Number(month)];

    if (day < 1 || day > maxDays) {
      dateValidationError.value = `Please enter a valid day between 1 and ${maxDays}.`;
      return false;
    }
  }

  dateValidationError.value = '';
  return true;
});

const genderGroup = [
  { label: "Male", value: "Male", disabled: false },
  { label: "Female", value: "Female", disabled: false },
];
const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean",
  "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian",
  "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian",
  "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian",
  "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean",
  "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech",
  "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian",
  "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French",
  "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan",
  "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian",
  "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian",
  "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz",
  "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger",
  "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese",
  "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan",
  "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Ni-Vanuatu",
  "Nicaraguan", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan",
  "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari",
  "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean",
  "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian",
  "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan",
  "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai",
  "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan",
  "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian",
  "Zimbabwean"
]

const nationalityGroup = nationalities.map((nationality) => ({
  label: nationality,
  value: nationality,
  disabled: false,
}))

const { updateUser, createUserByAdmin } = useUsersFetch();

const props = defineProps({
  userId: Number,
  showDisableEmails: {
    type: Boolean,
    default: true
  },
});
const emit = defineEmits(['userSaved', 'unsavedChanges']);

const user = ref<Partial<User>>({});
const showSuccessAlertCreate = ref(false)
const showSuccessAlertUpdate = ref(false)
const emailError = ref('')
const dateValidationError = ref('')

const genderValue = ref({
  label: user.value.gender,
  value: '',
  disabled: false,
});

const birthMonthValue = ref({} as SelectOptions)

const nationalityValue = ref({
  label: user.value.nationality,
  value: '',
  disabled: false,
});

async function fetchUser(id: number) {
  const response = await useApiV5Fetch(`users/${id}`);
  if (response.data?.value) {
    user.value = response.data.value;
    if (user.value.birthMonth) {
      let userBirthMonth = monthOptions.find(month => month.value === user.value.birthMonth)
      if(userBirthMonth) {
        birthMonthValue.value = userBirthMonth;
      }
    }
    if(user.value.nationality) {
      let userNatinolityData = nationalityGroup.find(nationality => nationality.value === user.value.nationality)
      if(userNatinolityData) {
        nationalityValue.value = userNatinolityData
      }
    }
    if(user.value.gender) {
      let userGenderData = genderGroup.find(gender => gender.value === user.value.gender);
      if(userGenderData) {
        genderValue.value = userGenderData
      }
    }
  } else {
    console.error('User data not found for ID:', id);
  }
}

async function saveUser() {
  loading.value = true
  if(isValidDate.value) {
    dateValidationError.value = ""
  }

  user.value.gender = genderValue.value.value
  user.value.nationality = nationalityValue.value.value
  user.value.birthMonth = birthMonthValue.value.value

  try {
    if (props.userId) {
      if (props.userId === userStore.user.id) {
        user.value.picture = userStore.user.picture
      }
     const response =  await updateUser(props.userId, {...user.value});
     if (response) {
      loading.value = false
      showSuccessAlertUpdate.value = true
      emit('unsavedChanges', false);
      }
    } else {
      const { picture, ...restOfUser } = user.value;
      const response = await createUserByAdmin({ ...restOfUser });
          if (response) {
          loading.value = true
          showSuccessAlertCreate.value = true
          emailError.value = ""
          emit('unsavedChanges', false);
          setTimeout(() => {
            navigateTo(`/super-admin/users/${response.id}`)
          }, 3000)

      } else {
        loading.value = false
        emailError.value = "Email must be unique"
      }
    }
  } catch (error) {
    loading.value = false
    console.error('Error saving user:', error);
  }
}

watch(() => user.value, (newVal, oldVal) => {

if (oldVal.id === undefined && newVal.id === props.userId && props.userId) {
  return;
}

if (oldVal && newVal) {
  emit('unsavedChanges', true);
  return;
}

if (oldVal.id && newVal.id === props.userId) {
  emit('unsavedChanges', true);
  return;
}

if (newVal) {
  emit('unsavedChanges', true);
}

}, { deep: true });
onMounted(() => {
  if (props.userId) {
    fetchUser(props.userId);
  }
});
</script>
