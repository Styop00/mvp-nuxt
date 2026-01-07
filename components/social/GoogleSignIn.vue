<template>
  <button
      :disabled="!isReady"
      @click="() => login()"
      class="flex justify-center items-center bg-gray-100 h-[32px] w-[32px] rounded-sm hover:bg-gray-200 transition-colors duration-200 ease-in-out delay-15"
  >
    <font-awesome :icon="['fab', 'google']" class="text-gray-500 text-sm"/>
  </button>
</template>

<script setup lang="ts">
import type {AuthCodeFlowErrorResponse, AuthCodeFlowSuccessResponse} from "vue3-google-signin";
import {useApiFetch} from "~/composables/useApiFetch";
import {useUserStore} from "~/store/user";

const userStore = useUserStore()

const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  if (response.access_token) {
    let res = await useApiFetch('/auth/google/sign-in', {
      method: 'post',
      body: {
        accessToken: response.access_token,
      }
    })

    if(res.data?.value) {
      const { accessToken, ...user } = res.data.value;
      const jwt = useCookie("accessToken", {
        maxAge: 2592000
      });
      jwt.value = accessToken;
      userStore.setToken(accessToken);
      userStore.setUser(user);
      if (user.seasonSports.length) {
        userStore.setSeasonSportId(user.seasonSports[0].id)
      }
      navigateTo('/')
    }

  }
};

const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});
</script>

<style scoped>

</style>