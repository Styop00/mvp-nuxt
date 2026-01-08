<template>
  <div
    class="bg-dark-surface-default border-r border-dark-border-default transition-all font-montserrat font-medium shadow-lg"
    :class="props.showFullSidebar ? 'w-60' : 'w-20'"
    @mouseover="() => hovered = true"
    @mouseleave="() => hovered = false"
  >
    <div
      class="h-14 fixed z-50 top-0 bg-dark-surface-default left-0 border-b border-dark-border-default flex items-center justify-center backdrop-blur-sm"
      :class="(props.showFullSidebar || hovered) ? 'w-60' : 'w-20'"
    >
      <p
        class="text-dark-text-primary text-3xl uppercase hover:text-brand-primary-color cursor-pointer font-bold flex items-center justify-center gap-4 transition-colors duration-300 group"
        @click="navigateTo('/')"
      >
        <img src="/images/logo.png" alt="#" class="w-8 transition-transform duration-300 group-hover:scale-110">
        <span class="text-xl" v-if="(props.showFullSidebar || hovered)">
          MVP 5.0
        </span>
      </p>
    </div>
    <div
      class="fixed z-50 top-[56px] left-0 bg-dark-surface-default overflow-y-auto sidebar px-3"
      :class="(props.showFullSidebar || hovered) ? 'w-60' : 'w-20 flex flex-col items-center'"
    >
      <p class="text-xxs text-dark-text-tertiary py-3 px-3 font-bold uppercase tracking-wider">
        <template v-if="props.showFullSidebar || hovered">
          <span> Main </span>
        </template>
        <template v-else>
          <span class="block w-1 h-1 rounded-full border border-dark-text-tertiary my-1.5" />
        </template>
      </p>
      <template v-for="navigation in navigations" :key="navigation.label">
        <template v-if="navigation.type === 'route'">
          <NavigationButton
            @click="handleClick(navigation)"
            :icon="navigation.icon"
            :label="navigation.label"
            :showLabel="props.showFullSidebar"
            :hovered="hovered"
            :activeTab="sidebarStore.activeTab"
          />
        </template>
        <template v-else-if="navigation.type === 'group_name'">
          <p class="text-xxs text-dark-text-tertiary py-3 px-3 font-bold uppercase tracking-wider">
            <template v-if="props.showFullSidebar || hovered">
              {{ $t(navigation.label.toLowerCase()) }}
            </template>
            <template v-else>
              <span
                class="block w-1 h-1 rounded-full border border-dark-text-tertiary my-1.5"
              />
            </template>
          </p>
          <template v-for="child in navigation.children" :key="child.label">
            <template v-if="child.type === 'route'">
              <NavigationButton
                @click="handleClick(child)"
                :icon="child.icon"
                :label="child.label"
                :showLabel="props.showFullSidebar"
                :hovered="hovered"
                :activeTab="sidebarStore.activeTab"
              />
            </template>
            <template v-else-if="child.type === 'route_group'">
              <GroupNavigation
                :icon="child.icon"
                :label="child.label"
                :children="child.children"
                :opened-navigations="openedNavigations"
                @click="handleClick(child)"
                @child-click="(data) => handleClick(data, child.label)"
                :showLabel="props.showFullSidebar"
                :hovered="hovered"
                :activeTab="sidebarStore.activeTab"
              />
            </template>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

import NavigationButton from "~/components/sidebar/navbars/NavigationButton.vue";
import GroupNavigation from "~/components/sidebar/navbars/GroupNavigation.vue";
import {useSidebarStore} from "~/store/sidebar";
import { useRoute } from 'vue-router';
import {useUserStore} from "~/store/user";

const props = defineProps({
  showFullSidebar: {
    type: Boolean,
    default: true
  },
})

const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const navigations = ref(sidebarStore.getNavigations())
const openedNavigations = ref([] as Array<String>)
const hovered = ref(false)

const route = useRoute();

watch(() => userStore.user?.id, () => {
  navigations.value = sidebarStore.getNavigations()
}, {
  deep: true,
  immediate: true,
})

function setActiveTabFromRoute() {
  const activePage = route.path.split('/')[1];

  if (!activePage) {
    sidebarStore.setActiveTab('Dashboard');
  } else {
    navigations.value.forEach((navItem: any) => {
      if (navItem.type === 'route' && navItem.route.includes(activePage)) {
        sidebarStore.setActiveTab(navItem.label);
      } else if (navItem.type === 'group_name' && navItem.children) {
        navItem.children.forEach((childNav: any) => {
          if (childNav.type === 'route_group' && childNav.children && Array.isArray(childNav.children)) {
            const childRoute = childNav.children.find(
              (routeChild: any) => routeChild && routeChild.route && routeChild.route.includes(route.path.split('/')[2])
            );
            if (childRoute) {
              openedNavigations.value = [childNav.label];
              sidebarStore.setActiveTab(childRoute.label);
            }
          } else if (childNav.route && childNav.route.includes(activePage)) {
              sidebarStore.setActiveTab(childNav.label);
          }
        });
      }
    });
  }
}

function handleClick(navigation: any, tab: string | null = null): void {
  if (navigation.type === 'route') {
    if (navigation.label === sidebarStore.activeTab && tab) {
      navigateTo(navigation.route);
      return
    }
    sidebarStore.setActiveTab(navigation.label);
    navigateTo(navigation.route);
    openedNavigations.value = navigation.parentLabel ? [navigation.parentLabel] : [];
  } else if (navigation.type === 'route_group') {
    if (openedNavigations.value.includes(navigation.label)) {
      openedNavigations.value.splice(openedNavigations.value.indexOf(navigation.label), 1);
    } else {
      if (openedNavigations.value.length) {
        setActiveTabFromRoute()
      }
      openedNavigations.value.push(navigation.label);
    }
  }
}

onMounted(() => {
  setActiveTabFromRoute();
});

watch(route, () => {
  setActiveTabFromRoute();
});
</script>

<style scoped lang="scss">
.sidebar {
  height: calc(100vh - 56px);

  &::-webkit-scrollbar {
    width: 0;
  }

  &:hover {
    &::-webkit-scrollbar {
      width: 8px;
      display: initial;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0 grey;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #334155;
      border-radius: 10px;
      border-right: 2px solid #1E293B;

      &:hover {
        background-color: #475569;
      }
    }

  }
}
</style>
