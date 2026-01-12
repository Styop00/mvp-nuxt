<template>
  <div class="bg-surface-default border-b border-border-default flex w-full items-center justify-between px-3 h-14 backdrop-blur-sm shadow-sm sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-in-out">
    <div class="cursor-pointer relative h-6 w-6 group"
         @click="() => emit('update:showFullSidebar', !props.showFullSidebar)">
      <template v-if="props.showFullSidebar">
        <button class="animated-arrow px-2.5 group-hover:opacity-80 transition-[opacity] duration-300 ease-in-out">
          <span class="w-3 block cursor-pointer transition-[background-color] duration-300 ease-in-out"></span>
        </button>
      </template>
      <template v-else>
        <button class="animated-arrow px-2.5 lg:hidden group-hover:opacity-80 transition-[opacity] duration-300 ease-in-out">
          <span class="w-3 block cursor-pointer transition-[background-color] duration-300 ease-in-out"></span>
        </button>
        <button class="px-2.5 hidden lg:inline-block text-text-secondary hover:text-text-primary transition-[color,opacity] duration-300 ease-in-out">
          <font-awesome :icon="['fas', 'xmark']" class="text-xl transition-[color,opacity] duration-300 ease-in-out"/>
        </button>
      </template>
    </div>
    <div class="flex items-center gap-4 h-full">
      <div class="w-full relative h-full flex items-center justify-center">
        <button class="block overflow-hidden rounded-full w-5 h-5 ring-2 ring-border-default hover:ring-brand-primary transition-[border-color,ring-color] duration-300 ease-in-out"
                @click.stop="toggleDropdown">
          <img :src="language.img" alt="img" class="w-full h-full transition-[opacity] duration-300 ease-in-out">
        </button>
        <Transition name="fade">
          <ul v-if="showCountriesDropdown" class="bg-surface-elevated border border-border-default rounded-lg shadow-sm absolute top-full mt-2 right-0 min-w-32 z-50 overflow-hidden backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-300 ease-in-out">
            <li v-for="language in languages" :key="language.locale">
              <button @click="setSelectedLanguage(language)"
                  class="p-2.5 flex items-center hover:bg-bg-hover hover:text-brand-primary text-text-secondary text-sm flex-nowrap gap-4 w-full border-b border-border-default last:border-b-0 cursor-pointer transition-[background-color,color,border-color] duration-300 ease-in-out">
                <img :src="language.img" class="w-4 h-4 rounded-full overflow-hidden transition-[opacity] duration-300 ease-in-out" alt="img">
                <span class="transition-[color] duration-300 ease-in-out">{{ language.label }}</span>
              </button>
            </li>
          </ul>
        </Transition>
      </div>
      <ColorModeToggle />
      <UserOptions v-model:showUserOptions="showUserOptions"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserOptions from "~/components/header/UserOptions.vue";
import ColorModeToggle from "~/components/ColorModeToggle.vue";

const props = defineProps({
  showDropdowns: {
    type: Boolean,
    default: false,
  },
  showFullSidebar: {
    type: Boolean,
    default: true,
  }
})

const showCountriesDropdown = ref(false)
const showUserOptions = ref(false)
const { setLocale, locale } = useI18n()
const language = ref({
  label: 'English',
  img: '/images/flags/us_flag.jpg',
  locale: 'en'
})

const languages = [
  {
    label: 'English',
    img: '/images/flags/us_flag.jpg',
    locale: 'en'
  },
  {
    label: 'Danish',
    img: '/images/flags/danish_flag.png',
    locale: 'dn'
  },
]

const emit = defineEmits([
  'update:showDropdowns',
  'update:showFullSidebar',
])

watch(() => locale.value, () => {
  language.value = languages.find(lang => lang.locale === locale.value) ?? languages[0]
}, {
  deep: true,
  immediate: true
})

watch(() => showCountriesDropdown.value, () => {
  if (showCountriesDropdown.value) {
    emit('update:showDropdowns', showCountriesDropdown.value)
    showUserOptions.value = false
  }
})

watch(() => showUserOptions.value, () => {
  if (showUserOptions.value) {
    emit('update:showDropdowns', showUserOptions.value)
    showCountriesDropdown.value = false
  }
})

watch(() => props.showDropdowns, () => {
  if (!props.showDropdowns) {
    showCountriesDropdown.value = false
    showUserOptions.value = false
  }
})

const setSelectedLanguage = (selectedLang: any) => {
  language.value = selectedLang
  setLocale(selectedLang.locale)
}

const toggleDropdown = () => {
  if (!showCountriesDropdown.value) {
    showUserOptions.value = false;
    showCountriesDropdown.value = true
  }
}
</script>

<style scoped>
.animated-arrow span {
  height: 0.125rem;
  @apply bg-text-tertiary;
  position: absolute;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  top: 50%;
  transform: translateY(-50%);
}

.animated-arrow:hover span {
  @apply bg-brand-primary;
}

.animated-arrow span:before {
  inset-block-start: -0.375rem;
}

.animated-arrow span:after {
  bottom: -0.375rem;
}

.animated-arrow span:before,
.animated-arrow span:after {
  cursor: pointer;
  height: 0.125rem;
  width: 17px;
  @apply bg-text-tertiary;
  position: absolute;
  display: block;
  content: "";
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-arrow:hover span:before,
.animated-arrow:hover span:after {
  @apply bg-brand-primary;
}
</style>