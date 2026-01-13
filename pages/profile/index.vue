<template>
  <div class="py-2 sm:py-4 lg:p-6 px-2 sm:px-4">
    <div class="animate-fade-in">
      <Breadcrumb />
      <div class="flex flex-col xl:flex-row gap-6 lg:gap-8 mt-4">
        <!-- Profile Information Card -->
        <div class="rounded-2xl bg-dark-surface-default shadow-xl border border-dark-border-default xl:w-2/3 w-full">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-dark-border-default bg-gradient-to-r from-dark-surface-default/50 to-dark-bg-primary/30 rounded-t-2xl">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-dark-text-primary">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"/>
              Profile Information
            </p>
          </div>

          <!-- Avatar Section -->
          <div class="p-6 border-b border-dark-border-default bg-gradient-to-br from-dark-bg-primary/30 to-dark-surface-default/30 overflow-hidden rounded-t-2xl">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div class="relative group">
                <div
                  class="relative rounded-full w-24 h-24 sm:w-28 sm:h-28 overflow-hidden border-4 border-dark-border-default hover:border-brand-primary-color transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-brand-primary-color/20"
                  @click="selectFiles"
                >
                  <input
                    type="file"
                    class="hidden"
                    ref="fileInput"
                    @click.stop
                    @change="onChangeFile"
                    accept="image/png, image/jpeg, image/jpg"
                  />

                  <div
                    class="absolute inset-0 flex items-center justify-center bg-dark-surface-elevated/90 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <font-awesome
                        :icon="['fas', 'upload']"
                        class="w-6 h-6 text-brand-primary-color"
                      />
                      <span class="text-xs font-semibold text-dark-text-primary">Upload</span>
                    </div>
                  </div>

                  <div
                    v-if="!user.picture"
                    class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-surface-elevated to-dark-bg-secondary"
                  >
                    <font-awesome :icon="['fas', 'user']" class="w-10 h-10 sm:w-12 sm:h-12 text-dark-text-tertiary" />
                  </div>

                  <img
                    v-if="user.picture"
                    :src="`${apiUrl}${userData.picture}`"
                    alt="User's profile picture"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-primary-color rounded-full border-4 border-dark-surface-default flex items-center justify-center shadow-lg">
                  <font-awesome :icon="['fas', 'camera']" class="text-white text-xs"/>
                </div>
              </div>

              <div class="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
                <h2 class="text-2xl sm:text-3xl font-bold text-dark-text-primary mb-2">
                  {{ user.name ? user.name : "User" }}
                </h2>
                <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span
                    v-for="(role, index) in user.roles"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary-color/10 text-brand-primary-color border border-brand-primary-color/20"
                  >
                    {{ role.description }}
                  </span>
                </div>
                <p class="text-sm text-dark-text-secondary mt-3 flex items-center gap-2">
                  <font-awesome :icon="['fas', 'envelope']" class="text-xs"/>
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error Messages -->
          <div class="px-6 pt-4 space-y-2">
            <div
              v-if="errorMessageInvalidTypeOfPicture"
              class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
            >
              <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
              <span>Only .png, .jpg and .jpeg format allowed!</span>
            </div>
            <div
              v-if="errorMessageInvalidSize"
              class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
            >
              <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
              <span>The file size exceeds 2MB. Please choose a different file.</span>
            </div>
          </div>

          <!-- User Form -->
          <div class="p-6">
            <UserForm :userId="user.id" :showDisableEmails="showDisableEmails" />
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="rounded-2xl bg-dark-surface-default shadow-xl border border-dark-border-default xl:w-1/3 w-full">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-dark-border-default bg-gradient-to-r from-dark-surface-default/50 to-dark-bg-primary/30 rounded-t-2xl">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-dark-text-primary">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"/>
              Change Password
            </p>
          </div>

          <!-- Password Form -->
          <form @submit.prevent="changePassword" class="p-6">
            <div class="space-y-5">
              <div>
                <label
                  for="current-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  Current Password
                </label>
                <PasswordInput
                  v-model="currentPassword"
                  type="password"
                  name="currentPsw"
                  id="current-password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label
                  for="new-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  New Password
                </label>
                <PasswordInput
                  v-model="password"
                  type="password"
                  name="newPsw"
                  id="new-password"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label
                  for="confirm-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  Confirm Password
                </label>
                <PasswordInput
                  v-model="confirmPassword"
                  type="password"
                  name="confirmPsw"
                  id="confirm-password"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <!-- Error Messages -->
              <div class="space-y-2">
                <div
                  v-if="!isCorrectCurrentPassword"
                  class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
                >
                  <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
                  <span>Incorrect current password</span>
                </div>
                <div
                  v-if="errorMessage"
                  class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
                >
                  <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
                  <span>{{ errorMessage }}</span>
                </div>
              </div>

              <!-- Submit Button -->
              <BaseButton
                type="submit"
                class="w-full py-3 mt-2 font-semibold"
              >
                <span class="flex items-center justify-center gap-2">
                  <font-awesome :icon="['fas', 'key']" class="text-sm"/>
                  Change Password
                </span>
              </BaseButton>
            </div>
          </form>
        </div>
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
/* Avatar hover effects */
.group:hover .user-icon {
  display: none;
}
</style>
