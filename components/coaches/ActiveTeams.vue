<template>
  <TableStriped
    :headers="headers"
    :clickable="true"
    :data="data"
    title="Active Teams"
    class="bg-white"
    :show-actions="true"
  >
    <template #actions="{ row }">
      <span class="relative group text-nowrap">
        <font-awesome
          :icon="['fas', 'volleyball']"
          @click="() => navigateTo(`${coach.id}/${row.id}/games`)"
          class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"
        />
        <span
          class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
        >
          Games
        </span>
      </span>
    </template>
  </TableStriped>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import TableStriped from '../tables/TableStriped.vue';
import type Coach from '~/interfaces/coaches/coach';
import type { CoachActiveTeamsTableData } from '~/interfaces/coaches/coachTableData';

const props = defineProps<{
  coach: Coach;
}>();

const data = ref([] as Array<CoachActiveTeamsTableData>);

const headers = [
  { label: 'Association', sortable: false, sortValue: '', dataKey: 'association' },
  { label: 'Team', sortable: false, sortValue: '', dataKey: 'team' },
  { label: 'Tournament', sortable: false, sortValue: '', dataKey: 'enough' },
  { label: 'Roles', sortable: false, sortValue: '', dataKey: 'roles' },
] as Array<TableHeader>;

onMounted(() => {

  if (props.coach?.person?.user?.userRoles) {
    data.value = props.coach.person.user.userRoles.map(item => {
      const tournaments = item.team?.tournaments || [];
      const tournamentNames = tournaments.map((tournament: any) => tournament?.shortName || 'Unknown Tournament').join(', ');

      return {
        id: item.teamId,
        association: item.club?.name ?? 'N/A',
        team: item.team?.localName ?? item.team?.tournamentName ?? 'Unknown Team',
        enough: tournamentNames || 'No tournaments',
        roles: item.role?.description ?? 'Unknown Role',
      };
    });
  } else {
    console.log('No user roles or data found for this coach');
  }
});
</script>
