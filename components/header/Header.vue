<template>
  <div class="bg-white flex w-full items-center justify-between px-3 h-14">
    <div class="cursor-pointer relative h-6 w-6"
         @click="() => emit('update:showFullSidebar', !props.showFullSidebar)">
      <template v-if="props.showFullSidebar">
        <button class="animated-arrow px-2.5">
          <span class="w-3 block cursor-pointer"></span>
        </button>
      </template>
      <template v-else>
        <button class="animated-arrow px-2.5 lg:hidden">
          <span class="w-3 block cursor-pointer"></span>
        </button>
        <button class="px-2.5 hidden lg:inline-block">
          <font-awesome :icon="['fas', 'xmark']" class="text-xl"/>
        </button>
      </template>
    </div>
    <div class="flex items-center gap-4 h-full">
      <div class="w-full relative h-full flex items-center justify-center">
        <button class="block overflow-hidden rounded-full w-5 h-5"
                @click.stop="toggleDropdown">
          <img :src="language.img" alt="img" class="w-full h-full">
        </button>
        <ul v-if="showCountriesDropdown" class="bg-white rounded-md absolute top-full mt-1 right-0 min-w-32">
          <li v-for="language in languages" :key="language.locale">
            <button @click="setSelectedLanguage(language)"
                class="p-2.5 flex items-center hover:bg-purple-500/5 hover:text-purple-500 text-gray-700 text-sm flex-nowrap gap-4 w-full border-b hover:bg-gray-100 cursor-pointer">
              <img :src="language.img" class="w-4 h-4 rounded-full overflow-hidden" alt="img">
              {{ language.label }}
            </button>
          </li>
        </ul>
      </div>
      <UserOptions v-model:showUserOptions="showUserOptions"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserOptions from "~/components/header/UserOptions.vue";

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

<style>
.animated-arrow span {
  height: 0.125rem;
  background: #536485;
  position: absolute;
  transition: all 0.05s ease-in-out;
  top: 50%;
  transform: translateY(-50%);
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
  background: #536485;
  position: absolute;
  display: block;
  content: "";
}
</style>