<template>
  <div class="flex justify-end items-center px-4 mr-2 h-full relative">
    <div
        @click.stop="showBox = !showBox"
        class="flex items-center justify-center gap-2 cursor-pointer"
    >
      <font-awesome :icon="['far', 'user']" class="text-md rounded-full p-2"/>
      <p class="text-sm text-gray-500 text-nowrap">
        {{ userStore.user?.name ? userStore.user.name : (userStore.user?.email ?? '') }}
      </p>
    </div>
    <div class="absolute top-full right-0 bg-white shadow-lg rounded-md mt-1 min-w-32 z-[999]" v-if="showBox">
      <p @click="navigateProfile"
         class="cursor-pointer text-sm hover:bg-purple-500/5 hover:text-purple-500 text-gray-700 px-4 py-2 flex items-center justify-start gap-3">
        <font-awesome :icon="['far', 'circle-user']"/>
        Profile
      </p>
      <p
          @click="logout()"
          class="cursor-pointer text-sm hover:bg-purple-500/5 hover:text-purple-500 text-gray-700 px-4 py-2 flex items-center justify-start gap-3"
      >
        <font-awesome :icon="['fas', 'arrow-right-from-bracket']"/>
        Sign Out
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/store/user";
import {useSidebarStore} from "~/store/sidebar";

const sidebarStore = useSidebarStore()

const props = defineProps({
  showUserOptions: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits([
  'update:showUserOptions',
])

const userStore = useUserStore()

const showBox = ref(false)

watch(() => showBox.value, () => {
  emit('update:showUserOptions', showBox.value)
})

watch(() => props.showUserOptions, () => {
  if (!props.showUserOptions) {
    showBox.value = false
  }
})

function logout() {
  userStore.resetState()
  showBox.value = false
  sidebarStore.setActiveTab('Dashboard')
  return navigateTo('/login')
}

function navigateProfile() {
  sidebarStore.setActiveTab('')
  navigateTo('/profile')
}
</script>

<style scoped></style>
