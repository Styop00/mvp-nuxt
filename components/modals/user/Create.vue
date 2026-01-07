<template>
  <BaseModalComponent v-model:visible="modal">
    <div>
      <p class="text-center">
        Create new user!
      </p>
      <form action="#" class="flex flex-col items-center gap-3 justify-center" @submit.prevent="submitForm()">
        <div>
          <TextInput v-model:value="email" placeholder="Email" type="email"/>
          <p v-if="errors.email" class="text-red-600 font-bold p-1 text-xs">
            {{ errors.email }}
          </p>
        </div>
        <div>
          <TextInput v-model:value="password" placeholder="Password" type="password"/>
          <p v-if="errors.password" class="text-red-600 font-bold p-1 text-xs">
            {{ errors.password }}
          </p>
        </div>
        <div>
          <TextInput v-model:value="name" placeholder="Name" type="text"/>
          <p v-if="errors.name" class="text-red-600 font-bold p-1 text-xs">
            {{ errors.name }}
          </p>
        </div>
        <BaseButton>
          Create
        </BaseButton>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useUserStore} from "~/store/user";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits([
  'update:visible',
  'reFetch'
])

const userStore = useUserStore()

const modal = ref(false)
const email = ref('')
const password = ref('')
const name = ref('')
let errors = reactive({
  email: '',
  password: '',
  name: ''
})

watch(() => props.visible, () => {
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

async function submitForm() {
  errors.email = '';
  errors.password = '';
  errors.name = '';

  if (!email.value) {
    errors.email = 'Email is required'
    return;
  }
  if (!password.value) {
    errors.password = 'Password is required'
    return;
  }
  if (!name.value) {
    errors.name = 'Name is required'
    return;
  }

  try {
    await userStore.addUser(email.value, password.value, name.value)
    emit('reFetch')
    modal.value = false

  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>

</style>