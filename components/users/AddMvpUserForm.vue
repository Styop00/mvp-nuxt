<template>
  <div class="grid grid-cols-1 items-center justify-center gap-8 w-full">
    <p class="font-bold border-b pb-1">
      Invite and create user for the club
    </p>
    <div>
      <TextInput
          v-model:value="email"
          label="Email"
          type="email"
          placeholder="Type email address for new user"
          :required="true"
      />
      <p v-if="error.type === 'email'" class="text-red-600 font-bold p-1 text-xs">
        {{ error.message }}
      </p>
      <p class="text-sm mt-2">
        If the user does not already exist, he/she will be created and <span class="font-bold">will be sent a welcome email</span>. You can then
        assign roles to the user, which the user can of course also do himself
      </p>
    </div>
    <div class="w-full flex items-center justify-center gap-8">
      <BaseButton
          class="!px-6 !py-3"
          @click="confirm"
      >
        Invite
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextInput from "~/components/inputs/TextInput.vue";
import {ref} from "vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useUserStore} from "~/store/user";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";

const props = defineProps({
  clubId: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['formClose', 'added'])

const {addClubUser} = useClubsFetch()
const userStore = useUserStore()
const email = ref('')
const error = ref({
  type: '',
  message: '',
})

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
})

async function confirm() {
  error.value = {
    type: '',
    message: '',
  }

  if (!email.value) {
    error.value = {
      message: "Email is required",
      type: 'email'
    };
  }  else if (!isValidEmail.value) {
    error.value = {
      message: "Email is not valid.",
      type: 'email'
    };
    return
  }

  if (error.value.type) return

  await addClubUser(props.clubId, {
    email: email.value,
    seasonSportId: userStore.seasonSportId
  })

  emit('added')
}

</script>