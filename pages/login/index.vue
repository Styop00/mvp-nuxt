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
        <form @submit.prevent="handleEnterKey">
          <div>
            <p
              class="text-[20px] font-inter-medium text-center mb-2 text-dark-text-primary"
            >
              Sign In
            </p>
            <p class="text-dark-text-tertiary text-[13px] text-center mb-4">
              Welcome back !
            </p>
            <p
              class="text-orange text-[13px] text-left p-3 border border-orange rounded-[0.35rem] mx-3"
              v-if="notification"
            >
              {{ notification }}
            </p>
            <div class="p-3">
              <div>
                <TextInput
                  class="block font-inter-medium font-intel text-xs mb-3"
                  label="User Email"
                  v-model:value="email"
                  placeholder="User email"
                  type="email"
                  autocomplete="email"
                  inputClasses="w-full mt-2 text-base !px-4 !py-2 border rounded-[0.35rem] bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all placeholder:text-dark-text-tertiary placeholder:text-[13px]"
                />
                <p v-if="emailError" class="text-red-700 text-xs mb-4">
                  {{ emailError }}
                </p>
              </div>
              <BaseButton
                class="flex items-center justify-center mt-5 w-full p-3"
                v-if="!showPasswordField"
              >
                Continue
              </BaseButton>
              <EmailModalComponent v-model:visible="showModal" :width="3" />
              <VerifyEmailModal
                v-model:visible="showModalVerifyEmail"
                :width="3"
              />
              <div v-if="showPasswordField">
                <div class="flex-column items-center justify-between">
                  <div class="flex items-center justify-between">
                    <label
                      for="signup-password"
                      class="block mb-2 font-inter-medium font-intel text-xs"
                    >
                      Password
                    </label>

                    <ResetPasswordModal
                      v-model:visible="showModalResetPassword"
                      :width="3"
                    />
                  </div>
                  <PasswordInputComponent
                    type="password"
                    v-model="password"
                    name="psw"
                    id="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <p v-if="loginError" class="text-red-700 text-xs mt-1">
                  {{ loginError }}
                </p>
              </div>
              <div class="mt-4">
                <BaseButton
                  type="submit"
                  v-if="showPasswordField"
                  class="w-full p-3 text-white"
                >
                  Sign In
                </BaseButton>
              </div>
            </div>
          </div>
        </form>

        <div class="text-center mt-4">
          <p class="text-sm text-dark-text-tertiary">
            Don't have an account?
            <NuxtLink to="/sign-up" class="text-brand-primary-color hover:text-brand-hover transition-colors hover:underline">
              Sign Up
            </NuxtLink>
          </p>

          <p
            v-if="showPasswordField"
            class="text-brand-primary-color hover:text-brand-hover transition-colors hover:underline mb-2 text font-intel text-xs cursor-pointer"
            @click="() => showConfirmModal = true"
          >
            Forget password?
          </p>
        </div>
        <div class="separator mx-4 my-6 text-dark-text-tertiary text-[13px]">OR</div>
        <div class="flex justify-center space-x-3">
          <GoogleSignIn />
        </div>
      </div>
    </div>
    <ConfirmationOrCancel
      v-model:visible="showConfirmModal"
      message="The app needs to send an email to reset your password. Do you want to proceed?"
      @confirm="visibleResetPasswordModal(email)"
    />
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/store/user";
import PasswordInputComponent from "~/components/inputs/PasswordInput.vue"
import TextInput from "~/components/inputs/TextInput.vue";
import {useApiFetch} from "~/composables/useApiFetch";
import GoogleSignIn from "~/components/social/GoogleSignIn.vue";
import EmailModalComponent from "~/components/modals/email-modal/EmailModalComponent.vue"
import VerifyEmailModal from "~/components/modals/verify-email/VerifyEmailModal.vue"
import ResetPasswordModal from "~/components/modals/reset-password-modal/ResetPasswordModal.vue";
import ConfirmationOrCancel from "~/components/modals/auth/ConfirmationDeleteModal.vue"
import BaseButton from "~/components/buttons/BaseButton.vue";

const route = useRoute()

definePageMeta({
  layout: 'auth',
  publicRoute: true,
})
const email = ref('')
const emailError = ref('')
const password = ref('')
const showPasswordField = ref(false);
const userStore = useUserStore()
const loginError = ref('');
const showModal = ref(false);
const showModalVerifyEmail = ref(false)
const showModalResetPassword = ref(false)
const notification = ref()
const showConfirmModal = ref(false)

if (route.query.token) {
  try {
    const token = route.query.token
    const response: any = await userStore.verifyEmail(token as string);
    if(!response.value) {
      notification.value = "Token expired, below write your email for recieving new token";
    }

  } catch (error){
    console.log(error);
  }

}

function handleEnterKey() {
  if (showPasswordField.value) {
    requestLogin();

  } else {
    checkEmail();

  }
}

async function requestLogin() {
  try {
    loginError.value = ''
    const response = await userStore.login(email.value, password.value)
    if (response.value) {
      navigateTo('/')
    }
  } catch (e: any) {
    loginError.value = e.toString()
  }
}

async function checkEmail() {
  emailError.value = ''
  if(!email.value) {
    emailError.value = 'Email field is required.'
    return
  }

  const response: any = await useApiFetch("/auth/validate/email", {
    method: "post",
    body: {
      email: email.value.toLowerCase(),
    },
  });

  if (!response.data.value && response.error.value?.message) {
    if (typeof response.error.value.data.message === 'string') {
      return emailError.value = response.error.value.data.message
    } else {
      return emailError.value = Object.values(response.error.value.data.message[0])[0] as string
    }
  }
  if(response.data._value === 'Your account is disabled. Please contact Support.') {
    emailError.value = `${response.data._value} support@mvpapp.dk`;
  } else if(response.data._value === 'Sent email.') {
    showModal.value = true
  } else if(response.data.value?.user) {
    showPasswordField.value = true
  } else if (response.data._value === "A new token has been sent because the previous one was expired.") {
    showModalVerifyEmail.value = true
  } else if (!response.data.value?.user) {
    emailError.value = 'Wrong email address.'
  }

}

async function visibleResetPasswordModal(email: string) {
  const response = await userStore.forgetPassword(email)
  showModalResetPassword.value = true
}
</script>
<style>
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
