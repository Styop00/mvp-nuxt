<template>
  <div class="p-6 xl:w-2/3 w-full bg-dark-surface-default ">
    <form @submit.prevent.stop class="space-y-6  w-full">
      <p
        class="text-base font-bold pb-4 flex items-center justify-start tracking-widest"
      >
        <span
          class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-red-500/50 to-pink-500/50 mr-3"
        />
        {{  props.refereeId ? "Edit Referee" : "Create Referee"  }}
      </p>
      <div
        v-if="props.refereeId"
        class="w-40 mb-1 xl:flex-nowrap flex-wrap"
        :class="['flex', 'flex-col', 'mb-2', { 'opacity-50 pointer-events-none': props.refereeId }]"
      >
        <TextInput
          label="License"
          v-model:value="referee.license"
          placeholder="License"
          type="text"
          :readonly="props.refereeId"
          @input="handleInputChange"
        />
      </div>
      <div class="flex gap-2 md:flex-nowrap flex-wrap">
        <div
          class="md:w-1/3 w-full mb-1"
          :class="['flex', 'flex-col', 'flex-wrap', 'mb-2', { 'opacity-50 pointer-events-none': props.refereeId }]"
        >
          <TextInput
            label="Email"
            v-model:value="referee.user.email"
            placeholder="Email"
            type="email"
            :readonly="props.refereeId"
            required
            @input="handleInputChange"
          />

          <p v-if="emailError" class="text-red-700 text-xs mt-2">
            {{ emailError }}
          </p>
        </div>
        <TextInput
          label="Name"
          v-model:value="referee.user.name"
          placeholder="Name"
          required
          type="text"
          class="md:w-1/3 w-full mb-1"
          @input="handleInputChange"
        />
        <TextInput
          label="Debtor No"
          v-model:value="referee.user.debtorNumber"
          placeholder="Debtor No"
          type="text"
          class="md:w-1/3 w-full mb-1"
          @input="handleInputChange"
        />
      </div>
      <div class="flex gap-2 md:flex-nowrap flex-wrap">
        <TextInput
          label="Country"
          v-model:value="referee.user.country"
          placeholder="Country"
          required
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />
        <TextInput
          label="City"
          v-model:value="referee.user.city"
          placeholder="City"
          required
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />
      </div>
      <div class="flex gap-2 md:flex-nowrap flex-wrap">
        <TextInput
          label="Address Line 1"
          v-model:value="referee.user.addressLine1"
          required
          placeholder="Address Line 1"
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />
        <TextInput
          label="Address Line 2"
          v-model:value="referee.user.addressLine2"
          placeholder="Address Line 2"
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />
      </div>

      <div class="flex gap-2 md:flex-nowrap flex-wrap">
        <TextInput
          label="Postal Code"
          v-model:value="referee.user.postalCode"
          placeholder="Postal code"
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />

        <TextInput
          label="Telephone numbers"
          v-model:value="referee.user.phoneNumbers"
          placeholder="Telephone numbers"
          type="text"
          class="md:w-1/2 w-full mb-1"
          @input="handleInputChange"
        />
      </div>

      <div class="flex gap-2 md:flex-nowrap flex-wrap">
        <Select
          label="Level"
          v-model:value="prio"
          :options="refereelevelsUI"
          class=""
          required
        />
        <TextInput
          label="Star rating 0-4"
          v-model:value="referee.maxStarRating"
          placeholder="Star rating"
          type="text"
          class="md:w-1/2 w-full mb-1"
          @change="handleInputChange"
        />
      </div>
      <div></div>

      <div class="flex gap-4 pb-6 md:flex-nowrap flex-wrap">
        <Select
          label="Do not judge lower than"
          v-model:value="prioMax"
          :options="seasonSportId !== 20 ? commissionerAndEvalLevelOptionsWithoutLast : commissionerAndEvalLevelOptions"
          class=""
          ref="clubSelect"
        />
        <Select
          label="Commissioner Level"
          v-model:value="commissionerLevel"
          :options="commissionerAndEvalLevelOptions"
          class=""
          ref="clubSelect"
        />
        <Select
          label="Assesses Level"
          v-model:value="evaluatorLevel"
          :options="commissionerAndEvalLevelOptions"
          class=""
        />
      </div>

      <div class="flex gap-[100px] pb-6 ">
        <div>Status</div>
        <dive class="flex flex-col gap-1">
          <div class="flex gap-12 md:flex-nowrap flex-wrap">
            <CheckBox
              v-model:value="referee.isActive"
              label="IsActive"
              name="IsActive"
              @change="handleInputChange"
            />
            <CheckBox
              v-model:value="referee.reserve"
              label="Reserve"
              name="Reserve"
              @change="handleInputChange"
            />
            <CheckBox
              v-model:value="referee.mentor"
              label="Mentor"
              name="Mentor"
              @change="handleInputChange"
            />
            <CheckBox
              v-model:value="referee.prospect"
              label="Prospect"
              name="Prospect"
              @change="handleInputChange"
            />
          </div>

          <p v-if="licenseErrorMessage" class="text-red-600 text-xs ">
            {{ licenseErrorMessage }}
          </p>
        </dive>
      </div>
      <div class="flex gap-[100px] ">
        <div>Restrictions</div>
        <dive class="flex flex-col gap-1">
          <div class="flex gap-12 md:flex-nowrap flex-wrap">
            <CheckBox
              v-model:value="referee.onlyWithBetter"
              label="Must judge with better"
              name="Must judge with better"
              @change="handleInputChange"
            />
            <CheckBox
              v-model:value="referee.canThree"
              label="Can referee 3-judge"
              name="Can referee 3-judge"
              @change="handleInputChange"
            />
          </div>

          <p v-if="licenseErrorMessage" class="text-red-600 text-xs ">
            {{ licenseErrorMessage }}
          </p>
        </dive>
      </div>

      <p v-if="requiredFieldsErrorMessage" class="text-red-700 text-xs mt-1">
        {{ requiredFieldsErrorMessage }}
      </p>

      <div class="flex justify-start mt-4">
        <BaseButton
          @on-click="createOrEditReferee"
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
      :text="`Referee has been successfully ${props.refereeId ? 'edited' : 'created'}.`"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '~/components/inputs/TextInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import Select from '../inputs/Select.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import CheckBox from '../inputs/CheckBox.vue';
import { useRefereesFetch } from '~/composables/useRefereeFetch/useRefereeFetch'
import { useUserStore } from '~/store/user';
import type { Referee } from '~/interfaces/referees/referee';
import { refereeLevels, refereeLevelsBasketball } from '~/constants/refereeLevelsPrio';

const props = defineProps<{
  refereeId: Number;
}>();

const emit = defineEmits(['refreshData']);

const showSuccessAlertCreate = ref(false)
const loadingbutton = ref(false)
const requiredFieldsErrorMessage = ref("")
const licenseErrorMessage = ref('');
const clubSelect = ref<InstanceType<typeof Select> | null>(null)
const prio = ref ({} as SelectOptions)
const prioMax = ref ({ label: "", value: "", disabled: false } as SelectOptions)
const commissionerLevel = ref ({ label: "", value: "", disabled: false } as SelectOptions)
const evaluatorLevel = ref ({ label: "", value: "", disabled: false } as SelectOptions)
const emailError = ref("")
const { seasonSportId } = useUserStore()

const referee = ref({
  user: {
    email: "",
    name: "",
    debtorNumber: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    phoneNumbers: ""
  }}
)

const newItem1 = { label: "--- ikke angivet ---", value: "0", disabled: false };
const newItem2 =   {
    label: "Ingen",
    value: "0",
    disabled: false,
  };
const newItem3 = { label: "Klubdommer", value: "0", disabled: false };

const refereelevelsUI = computed(() => {
  return [
    ...(seasonSportId === 20 ? refereeLevelsBasketball : [newItem3, ...refereeLevels]),
  ]
})
prio.value = refereelevelsUI.value[0];

const { getRefereeById, createEditRef } = useRefereesFetch()

const newItem = { label: "8: Club matches + Unattached ranks", value: "8", disabled: false };

const commissionerAndEvalLevelOptions = computed(() => {
  const options = seasonSportId === 20 ? refereeLevelsBasketball : [newItem1, newItem2, ...refereeLevels];
  return seasonSportId !== 20 ? [...options, newItem] : options;
});

const commissionerAndEvalLevelOptionsWithoutLast = computed(() => {
  return commissionerAndEvalLevelOptions.value.slice(0, -1);
});

function getOptionLabel(options: Array<SelectOptions> | ComputedRef<Array<SelectOptions>>, value: string) {
  const optionsArray = Array.isArray(options) ? options : options.value;
  return optionsArray.find(opt => opt.value == value)?.label || "";
}

function isValidEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(referee.value.user.email);
}

function isFormValid() {
  if (!referee.value.user.email || !referee.value.user.name || !referee.value.user.addressLine1 || !referee.value.user.city || !referee.value.user.country) {
    return false
  };
  return true
}

function handleInputChange(eventOrValue: any) {
  const inputValue = eventOrValue && eventOrValue.target ? eventOrValue.target.value : eventOrValue;
}
async function createOrEditReferee() {
  loadingbutton.value = true;
  requiredFieldsErrorMessage.value = '';
  emailError.value = '';

  if (!isFormValid()) {
    loadingbutton.value = false;
    requiredFieldsErrorMessage.value =  "Please fill in all required fields."
    return;
  }

  if (!isValidEmail()) {
    loadingbutton.value = false;
    emailError.value = "Please enter a valid email address.";
    return
  }

  const body = {
    email: referee.value.user.email,
    name: referee.value.user.name,
    debtorNumber: referee.value.user.debtorNumber,
    addressLine1: referee.value.user.addressLine1,
    addressLine2: referee.value.user.addressLine2,
    postalCode: referee.value.user.postalCode,
    phoneNumbers: referee.value.user.phoneNumbers,
    maxStarRating: referee.value.maxStarRating,
    city: referee.value.user.city,
    IsActive: referee.value.IsActive,
    reserve: referee.value.reserve,
    mentor: referee.value.mentor,
    prospect: referee.value.prospect,
    onlyWithBetter: referee.value.onlyWithBetter,
    canThree: referee.value.canThree,
    ...(props.refereeId && { refId: props.refereeId }),
    commisionerLevel: Number(commissionerLevel.value.value),
    evaluatorLevel: Number(evaluatorLevel.value.value),
    prio: Number(prio.value.value),
    prioMax: Number(prioMax.value.value)
  };

  const response = await createEditRef(body);

    if (response === "success") {
      showSuccessAlertCreate.value = true
      setTimeout(() => {
          emit('refreshData')
          navigateTo('/referees/referees');
        }, 2000);

      emit('refreshData')
    } else {
      loadingbutton.value = false;
    }
  }


  onMounted(async () => {
    if (props.refereeId) {
      const response = await getRefereeById(props.refereeId as number) as Referee;
      referee.value = response;

      prio.value = {
        label: getOptionLabel(refereelevelsUI, referee.value.prio),
        value: referee.value.prio,
        disabled: false
      };

      prioMax.value = {
        label: getOptionLabel(commissionerAndEvalLevelOptions, referee.value.prioMax ),
        value: referee.value.prioMax ,
        disabled: false
      };

      commissionerLevel.value = {
        label: getOptionLabel(commissionerAndEvalLevelOptions, referee.value.commisionerLevel),
        value: referee.value.commisionerLevel,
        disabled: false
      };

      evaluatorLevel.value = {
        label: getOptionLabel(commissionerAndEvalLevelOptions, referee.value.evaluatorLevel),
        value:  referee.value.evaluatorLevel,
        disabled: false
      };
    }
  });
</script>
