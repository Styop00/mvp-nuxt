<template>
  <TableStriped
    :headers="headers"
    :clickable="true"
    :data="data"
    title="Former Teams"
    class="bg-white "
  >
  </TableStriped>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import TableStriped from '../tables/TableStriped.vue';
import type Coach from '~/interfaces/coaches/coach';
import type { CoachFormerTeamsTableData } from '~/interfaces/coaches/coachTableData';

const props = defineProps<{
  coach: Coach;
}>();

const data = ref([] as Array<CoachFormerTeamsTableData>);

const headers = [
  { label: 'Association', sortable: false, sortValue: '', dataKey: 'association' },
  { label: 'Team', sortable: false, sortValue: '', dataKey: 'team' },
  { label: 'Row', sortable: false, sortValue: '', dataKey: 'row' },
  { label: 'Season', sortable: false, sortValue: '', dataKey: 'season' },
] as Array<TableHeader>;

onMounted(() => {

  if (props.coach?.person?.user?.user_roles) {
    data.value = props.coach.coachHistories.map(item => {

      return {
        association: item.clubName,
        team: item.team.localName,
        row: item.tournamentName,
        season: item.seasonName
      };
    });

  } else {
    console.log('No user roles or data found for this coach');
  }
});
</script>
