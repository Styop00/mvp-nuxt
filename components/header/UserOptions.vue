<template>
  <div class="flex justify-end items-center px-4 mr-2 h-full relative">
    <div
        @click.stop="showBox = !showBox"
        class="flex items-center justify-center gap-2 cursor-pointer"
    >
      <font-awesome :icon="['far', 'user']" class="text-md rounded-full p-2"/>
      <p class="text-sm text-dark-text-secondary text-nowrap">
        {{ userStore.user?.name ? userStore.user.name : (userStore.user?.email ?? '') }}
      </p>
    </div>
    <Transition name="fade">
      <div class="absolute top-full right-0 bg-dark-surface-elevated border border-dark-border-default shadow-xl rounded-lg mt-1 min-w-32 overflow-hidden" v-if="showBox" style="z-index: 99999 !important; position: absolute !important;">
        <p @click="navigateProfile"
           class="cursor-pointer text-sm hover:bg-dark-bg-hover hover:text-brand-primary-color text-dark-text-secondary px-4 py-2 flex items-center justify-start gap-3 transition-colors duration-200">
          <font-awesome :icon="['far', 'circle-user']"/>
          Profile
        </p>
        <p
            @click="logout()"
            class="cursor-pointer text-sm hover:bg-dark-bg-hover hover:text-red-500 text-dark-text-secondary px-4 py-2 flex items-center justify-start gap-3 transition-colors duration-200"
        >
        <font-awesome :icon="['fas', 'arrow-right-from-bracket']"/>
        Sign Out
      </p>
      </div>
    </Transition>
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
