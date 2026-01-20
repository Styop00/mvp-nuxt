<template>
  <div
    class="w-full min-h-screen flex items-center justify-center bg-login-reg-bg"
  >
    <div class="w-full max-w-lg p-4 sm:p-8 md:p-12 rounded-lg">
      <div class="mb-6 sm:mb-8 md:mb-12">
        <NuxtLink class="flex justify-center items-center gap-2" to="/public">
          <span class="text-2xl font-bold bg-gradient-to-br from-white via-red-500 to-red-950 bg-clip-text text-transparent">T</span>
          <span class="text-xl text-white"> Tourney </span>
        </NuxtLink>
      </div>
      <div
        class="w-full max-w-md p-4 sm:p-8 md:p-12 bg-dark-surface-default shadow-sm rounded-lg"
      >
        <div class="mb-8">
          <p
            v-if="!notification"
            class="text-[20px] font-inter-medium text-center mb-2 text-dark-text-primary"
          >
            Create Password
          </p>
          <p
            v-if="notification"
            class="text-[20px] font-inter-medium text-center mb-2 text-dark-text-primary"
          >
            Create Password Failed
          </p>
        </div>
        <p v-if="notification">
          Token expired. Please
          <NuxtLink to="/login" class="text-orange-600">click here</NuxtLink> to
          try again.
        </p>

        <form v-if="!notification" @submit.prevent="registerUser">
          <div class="mb-5">
            <label
              for="signup-password"
              class="block mb-2 font-inter-medium font-intel text-xs"
              >New Password</label
            >
            <PasswordInputComponent
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
            <PasswordInputComponent
              v-model="confirmPassword"
              type="password"
              name="confirmPsw"
              id="signup-confirm-password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <p v-if="!isMatch" class="text-red-500 text-xs mt-2">
            Passwords do not match.
          </p>
          <BaseButton
            type="submit"
            @click="() => registerUser()"
            class="flex items-center justify-center w-full p-3 mb-4"
          >
            <p class="text-white">Create</p>
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasswordInputComponent from '~/components/inputs/PasswordInput.vue';
import { useUserStore } from '~/store/user';
import BaseButton from "~/components/buttons/BaseButton.vue";

definePageMeta({
  layout: 'auth',
  publicRoute: true,
});

const route = useRoute();
const email = ref();
const password = ref('');
const confirmPassword = ref('');
const isMatch = ref(true);
const userStore = useUserStore();
const notification = ref(false)

if (route.query.token) {
  try {
    const token = route.query.token
    email.value = route.query.email
    const response: any = await userStore.verifyEmail(token as string);
    if(!response.value) {
      notification.value = true
    }

  } catch (error){
    console.log(error);
  }

}
const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    isMatch.value = false;
    return;
  } else {
    isMatch.value = true;
  }

  try {
    const response = await userStore.resetPassword(email.value as string, password.value);
    if (response) {
      navigateTo("/login");
    }
  } catch (error) {
    console.error('Password reset failed:', error);
  }
}
</script>
