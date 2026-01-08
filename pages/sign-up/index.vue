<template>
  <div
    class="w-full min-h-screen flex items-center justify-center bg-dark-bg-primary"
  >
    <div class="w-full max-w-lg p-4 sm:p-8 md:p-12 rounded-lg animate-fade-in">
      <div class="mb-6 sm:mb-8 md:mb-12">
        <NuxtLink class="flex justify-center items-center gap-1.5 group" to="/">
          <img src="/images/logo.png" alt="#" class="w-8 transition-transform duration-300 group-hover:scale-110">
          <span class="text-xl text-dark-text-primary font-semibold"> MVP 5.0 </span>
        </NuxtLink>
      </div>
      <div
        class="w-full max-w-md p-4 sm:p-8 md:p-12 bg-dark-surface-default border border-dark-border-default shadow-xl rounded-xl backdrop-blur-sm"
      >
        <div class="mb-8">
          <p class="text-xl font-inter-medium text-center mb-2 text-dark-text-primary">
            Sign Up
          </p>
          <p class="text-dark-text-tertiary text-[13px] text-center mb-4">
            Welcome & Join us by creating a free account !
          </p>
        </div>
        <form @submit.prevent="registerUser" autocomplete="off">
          <TextInput
            class="block mb-4 font-inter-medium font-intel text-xs"
            label="Full Name"
            v-model:value="name"
            placeholder="Full Name"
            type="text"
            :required="true"
            name="name"
            autocomplete="off"
            inputClasses="w-full mt-2 text-base !px-4 !py-2 border rounded-[0.35rem] bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all placeholder:text-dark-text-tertiary placeholder:text-[13px]"
          />
          <p v-if="errors.name" class="text-red-500 text-xsm">
            {{ errors.name }}
          </p>
          <TextInput
            class="block mb-1 font-inter-medium font-intel text-xs"
            label="Email"
            v-model:value="email"
            placeholder="Email"
            type="text"
            name="email"
            :required="true"
            autocomplete="off"
            inputClasses="w-full mt-2 text-base !px-4 !py-2 border rounded-[0.35rem] bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all placeholder:text-dark-text-tertiary placeholder:text-[13px]"
          />
          <p v-if="errors.email" class="text-red-500 text-xs">
            {{ errors.email }}
          </p>
          <div class="mb-4">
            <label
              for="signup-password"
              class="block mb-2  mt-4 font-inter-medium font-intel text-xs text-dark-text-primary"
            >
              Password
            </label>
            <PasswordInputComponent
              v-model="password"
              type="password"
              name="psw"
              id="signup-password"
              placeholder="Password"
              required
              autocomplete="off"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1 mb-3">
            {{ errors.password }}
          </p>
          </div>
       
          <div class="mb-1">
            <label
              for="signup-confirm-password"
              class="block mb-2 font-inter-medium font-intel text-xs text-dark-text-primary"
            >
              Confirm Password
            </label>
            <PasswordInputComponent
              v-model="confirmPassword"
              type="password"
              name="confirmPsw"
              id="signup-confirm-password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mb-3">
            Passwords do not match.
          </p>
          <div
            class="text-dark-text-tertiary text-[13px] mt-4 flex items-start justify-between gap-2"
          >
            <input
              type="checkbox"
              value=""
              id="defaultCheck1"
              required
              class="mt-1"
            />
            <label for="defaultCheck1">
              By creating an account you agree to our
              <NuxtLink
                to="https://mvpapp.dk/termsandconditions.php"
                target="_blank"
                class="text-brand-green"
              >
                <u>Terms & Conditions</u>
              </NuxtLink>
              and
              <NuxtLink
                to="https://mvpapp.dk/privacypolicy.php"
                target="_blank"
              >
                <u class="text-brand-green">Privacy Policy</u>
              </NuxtLink>
            </label>
          </div>
          <BaseButton
            type="submit"
            class="flex items-center justify-center w-full p-3 mt-5 mb-4"
          >
            <span class="text-white">Create Account</span>
          </BaseButton>
        </form>

        <VerifyEmailModal v-model:visible="showModal" :width="3" />
        <div class="text-dark-text-tertiary text-[12px] text-center mb-4">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="text-brand-primary-color hover:text-brand-hover transition-colors hover:underline">
              Sign In
            </NuxtLink>
          </p>
        </div>
        <div class="separator mx-4 my-6 text-dark-text-tertiary text-[13px]">OR</div>
        <div class="flex justify-center space-x-3">
          <GoogleSignIn />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import PasswordInputComponent from '~/components/inputs/PasswordInput.vue';
import {definePageMeta} from '#imports';
import {useUserStore} from '~/store/user';
import TextInput from "~/components/inputs/TextInput.vue";
import GoogleSignIn from "~/components/social/GoogleSignIn.vue";
import VerifyEmailModal from "~/components/modals/verify-email/VerifyEmailModal.vue"
import BaseButton from "~/components/buttons/BaseButton.vue";

definePageMeta({
  layout: 'auth',
  publicRoute: true,
});

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const userStore = useUserStore();
const showModal = ref(false)
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const registerUser = async () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match.'
    return;
  }

  try {
    const response = await userStore.register(name.value, email.value, password.value)
    // @ts-ignore
    if (response.error?.value) {
      // @ts-ignore
      response.error.value.data.message.forEach((error: object) => {
        // @ts-ignore
        errors.value[Object.keys(error)[0]] = Object.values(error)[0]
        
      })
    } else {
      showModal.value = true

    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
</script>

<style scoped>
.separator {
  display: flex;
  align-items: center;
  text-align: center;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #334155;
  opacity: 0.5;
}

.separator::before {
  margin-right: .5em;
}

.separator::after {
  margin-left: .5em;
}
</style>
