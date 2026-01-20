<template>
  <div class="mt-6 animate-fade-in">
    <p class="text-[32px] font-bold mb-6 pl-6 text-dark-text-primary">{{ $t('dashboard') }}</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-6 px-6">
      <DashboardItem
          v-for="(item, index) in dashboardItems"
          :key="index"
          :to="item.to"
          :text="item.text"
          :color="item.color"
          :count="item.count"
          :icon="item.icon"
          :navigationLabel="item.navigationLabel"
          :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import DashboardItem from '~/components/adminDashboard/DashboardItem.vue';
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch.ts";
import {useUserStore} from "~/store/user.ts";
import {useMessageFetch} from "~/composables/useMessagesFetch/useMessagesFetch.ts";

const {getGamesCount} = useGamesFetch()
const {getMessagesCount} = useMessageFetch()
const userStore = useUserStore()

const loading = ref(false)
const dashboardItems = ref([
  {
    to: '/tournament/attention',
    navigationLabel: 'Tournament',
    text: 'Attention',
    color: 'text-purple-500',
    count: 0,
    icon: 'exclamation'
  },
  {
    to: '/tournament/conflicts',
    navigationLabel: 'Tournament',
    text: 'Conflicts',
    color: 'text-custom-blue',
    count: 0,
    icon: 'question'
  },
  {
    to: '/tournament/moving-in-progress',
    navigationLabel: 'Tournament',
    text: 'Moving In Progress',
    color: 'text-brand-green',
    count: 0,
    icon: 'truck-moving'
  },
  {
    to: '',
    navigationLabel: '',
    text: 'User messages sent',
    color: 'text-custom-yellow',
    count: 0,
    icon: 'envelope'
  }
]);

async function getData() {
  loading.value = true;
  try {
    const results = await Promise.all([
      getGamesCount({type: 'attention', seasonSportId: userStore.seasonSportId}),
      getGamesCount({type: 'conflicts', seasonSportId: userStore.seasonSportId}),
      getGamesCount({statusId: 4, seasonSportId: userStore.seasonSportId}),
      getMessagesCount(),
    ])

    dashboardItems.value[0].count = results[0] ?? 0
    dashboardItems.value[1].count = results[1] ?? 0
    dashboardItems.value[2].count = results[2] ?? 0
    dashboardItems.value[3].count = results[3] ?? 0
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Set all counts to 0 on error
    dashboardItems.value.forEach(item => item.count = 0);
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!userStore.isAdmin) {
    navigateTo('fighting')
  } else {
    getData()
  }
})
</script>
