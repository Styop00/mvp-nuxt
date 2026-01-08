<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div>
      <h3 class="text-lg font-bold mb-4">
        {{ id ? 'Update User' : 'Create User' }}
      </h3>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary">Name</label>
          <input
            v-model="name"
            type="text"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Picture URL</label
          >
          <input
            v-model="picture"
            type="text"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Disable Emails</label
          >
          <input
            v-model="disableEmails"
            type="checkbox"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary">License</label>
          <input
            v-model="license"
            type="number"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary">Gender</label>
          <input
            v-model="gender"
            type="text"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Birth Year</label
          >
          <input
            v-model="birthYear"
            type="number"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Birth Month</label
          >
          <input
            v-model="birthMonth"
            type="number"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Birth Day</label
          >
          <input
            v-model="birthDay"
            type="number"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Nationality</label
          >
          <input
            v-model="nationality"
            type="text"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-dark-text-primary"
            >Is Verified</label
          >
          <input
            v-model="isVerified"
            type="checkbox"
            class="mt-1 block w-full rounded-md border-dark-border-default shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="flex justify-end">
          <BaseButton
            type="submit"
            class="mr-2"
            >{{ id ? 'Update' : 'Create' }}</BaseButton
          >
          <BaseButton
            type="button"
            class="bg-red-600 text-white"
            @click="modal = false"
            >Cancel</BaseButton
          >
        </div>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useUsersFetch } from '~/composables/useUsersFetch/useUsersFetch';
import type { EditUser } from '~/interfaces/users/users';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  picture: {
    type: String,
    default: '',
  },
  disableEmails: {
    type: Boolean,
    default: false,
  },
  license: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
    default: '',
  },
  birthYear: {
    type: Number,
    default: 0,
  },
  birthMonth: {
    type: Number,
    default: 0,
  },
  birthDay: {
    type: Number,
    default: 0,
  },
  nationality: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'refreshData']);

const modal = ref(false);
const email = ref(props.email);
const name = ref(props.name);
const picture = ref(props.picture);
const disableEmails = ref(props.disableEmails);
const license = ref(props.license);
const gender = ref(props.gender);
const birthYear = ref(props.birthYear);
const birthMonth = ref(props.birthMonth);
const birthDay = ref(props.birthDay);
const nationality = ref(props.nationality);
const isVerified = ref(props.isVerified);

const { createUser, updateUser } = useUsersFetch();

watch(() => props.visible, () => {
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

async function handleSubmit() {
  const user: EditUser = {
    email: email.value,
    name: name.value,
    picture: picture.value,
    disableEmails: disableEmails.value,
    license: license.value,
    gender: gender.value,
    birthYear: birthYear.value,
    birthMonth: birthMonth.value,
    birthDay: birthDay.value,
    nationality: nationality.value,
    isVerified: isVerified.value,
  };

  if (props.id) {
    await updateUser(props.id, user);
  } else {
    await createUser(user);
  }
  emit('refreshData');
  modal.value = false;
}
</script>
