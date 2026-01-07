<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="flex gap-8 flex-wrap lg:flex-nowrap">
      <div class="rounded-lg bg-white p-6 xl:w-2/3 w-full">
        <p
          class="text-base p-4 font-bold flex items-center justify-start tracking-widest"
        >
          <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
          />
          Profile
        </p>
        <div class="p-4">
          <div class="flex items-center">
            <div
              class="relative rounded-full w-[85px] h-[85px] overflow-hidden hover:bg-gray-100 bg-gray-100 some"
            >
              <input
                type="file"
                class="hidden"
                ref="fileInput"
                @click.stop
                @change="onChangeFile"
                accept="image/png, image/jpeg, image/jpg"
              />

              <button
                class="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-0 hover:opacity-50 transition-opacity duration-300 "
              >
                <font-awesome
                  :icon="['fas', 'upload']"
                  class="w-6 h-6 text-gray-900 "
                  @click="selectFiles"
                />
              </button>

              <div
                v-if="!user.picture"
                class="user-icon absolute inset-0 flex items-center justify-center bg-gray-200 opacity-50 hover:opacity-0 transition-opacity duration-300 "
              >
                <font-awesome :icon="['fas', 'user']" class="m-auto w-6 h-6" />
              </div>

              <img
                v-if="user.picture"
                :src="`${apiUrl}${userData.picture}`"
                alt="User's profile picture"
                class="w-full h-full object-cover hover:opacity-0 transition-opacity duration-300"
              />
            </div>

            <div class="flex flex-col pl-5 w-2/3">
              <p class="text-nowrap text-black text-[24px] ">
                {{ user.name ? user.name : "" }}
              </p>
              <p
                class="text-wrap text-black text-sm "
                v-html="user.roles.map((role: any) => `<span>${role.description}</span>`).join(', ')"
              ></p>
            </div>
          </div>
        </div>
        <p
          v-if="errorMessageInvalidTypeOfPicture"
          class="ml-4 text-red-600 bg-red-100 text-[10px] border border-red-400 p-2 rounded-lg font-bold w-[190px]"
        >
          Only .png, .jpg and .jpeg format allowed!
        </p>
        <p
          v-if="errorMessageInvalidSize"
          class="ml-4 text-red-600 bg-red-100 text-[10px] border border-red-400 p-2 rounded-lg font-bold w-[190px]"
        >
          'The file size exceeds 2MB. Please choose a different file.'
        </p>

        <UserForm :userId="user.id" :showDisableEmails="showDisableEmails" />
      </div>
      <div class="rounded-lg bg-white p-6 xl:w-1/3 sm:w-1/2 w-full">
        <p
          class="text-base p-4 font-bold flex items-center justify-start tracking-widest"
        >
          <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
          />
          Change password
        </p>
        <form @submit.prevent="changePassword" class="p-4">
          <div class="mb-5">
            <label
              for="signup-password"
              class="block mb-2 font-inter-medium font-intel text-xs"
              >Current Password</label
            >
            <PasswordInput
              v-model="currentPassword"
              type="password"
              name="psw"
              id="signup-password"
              placeholder="Password"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="signup-password"
              class="block mb-2 font-inter-medium font-intel text-xs"
              >New Password</label
            >
            <PasswordInput
              v-model="password"
              type="password"
              name="psw"
              id="signup-password"
              placeholder="Password"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="signup-confirm-password"
              class="block mb-2 font-inter-medium font-intel text-xs"
              >Confirm Password</label
            >
            <PasswordInput
              v-model="confirmPassword"
              type="password"
              name="confirmPsw"
              id="signup-confirm-password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <p v-if="!isCorrectCurrentPassword" class="text-red-500 text-xs my-2">
            Incorrect current password
          </p>
         
          <p v-if="errorMessage" class="text-red-500 text-xs my-2">
            {{ errorMessage }}
          </p>
          <BaseButton
            type="submit"
            class="flex items-center justify-center w-full p-3 mb-4"
          >
            <p class="text-white">Change</p>
          </BaseButton>
        </form>
      </div>

      <SuccessAlert
        v-model:visible="showSuccessAlertUpdate"
        text="Your password has been successfully changed."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserForm from '~/components/forms/UserForm.vue';
import { useUserStore } from "~/store/user";
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import PasswordInput from '~/components/inputs/PasswordInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';

const config = useRuntimeConfig()

const apiUrl = config.public.backendURL

const showDisableEmails = ref(false)

const { user, token } = useUserStore();
const userStore = useUserStore()

const userData = computed(() => {
  return useUserStore().user
})

const fileInput =ref()
const selectedFile = ref()
const errorMessageInvalidTypeOfPicture = ref(false)
const errorMessageInvalidSize = ref(false)
const isCorrectCurrentPassword = ref(true)
const password = ref("")
const confirmPassword = ref("")
const currentPassword = ref("")
const showSuccessAlertUpdate = ref(false)
const errorMessage = ref("");

async function selectFiles() {
    fileInput.value.click()
}

async function onChangeFile() {
  try {
    errorMessageInvalidTypeOfPicture.value = false
    errorMessageInvalidSize.value = false
    selectedFile.value = fileInput.value.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (selectedFile.value.size > maxSize) {
      errorMessageInvalidSize.value = true;
    } else {
      const data = new FormData();
        data.append('picture', selectedFile.value);
        const response = await useApiV5Fetch(`users/${user.id}`, {
          method: "put",
          headers: {
            'Authorization':`Bearer ${token}`,
          },
          body: data,
        });

      useUserStore().getMe()

      if(!response.data.value ) {
        errorMessageInvalidTypeOfPicture.value = true
      }
    }
    } catch (error) {
    console.error('Error saving user:', error);
  }
}

const validatePasswords = () => {
  errorMessage.value = "";

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return false;
  }

  if (password.value.length < 8 || confirmPassword.value.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long.";
    return false;
  }

  return true;
};

const changePassword = async () => {
  isCorrectCurrentPassword.value = true;
errorMessage.value = ""
  if (!validatePasswords()) {
    return; 
  }

  try {
    const response = await userStore.changePassword(
      user.email as string,
      currentPassword.value,
      password.value
    );

    if (response && response.value && response.value === "Incorrect current password") {
      isCorrectCurrentPassword.value = false;
    } else {
      isCorrectCurrentPassword.value = true;
      showSuccessAlertUpdate.value = true;
      currentPassword.value = "";
      password.value = "";
      confirmPassword.value = "";
    }

  } catch (error) {
    console.error("Password reset failed:", error);
  }
};
</script>

<style scoped>
.some:hover .user-icon {
  display: none;
}
</style>
