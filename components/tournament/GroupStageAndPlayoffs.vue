<template>
  <div class="mt-6 group-stage-wrapper">
    <!-- Group Stage Section -->
    <div class="groups-section mb-12">
      <h3 class="text-xl font-bold mb-6 section-title flex items-center gap-3">
        <span class="w-2 h-8 bg-blue-500 rounded"></span>
        Group Stage
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
            v-for="(group, groupIndex) in groupedTeams" 
            :key="groupIndex" 
            class="group-card"
        >
          <div class="group-header">
            <span class="group-letter">{{ group.name }}</span>
          </div>
          <div class="group-teams">
            <div 
                v-for="(team, teamIndex) in group.teams" 
                :key="team.id" 
                class="team-row"
                :class="{ 'qualifying': teamIndex < 2 }"
            >
              <div class="position" :class="{ 'qualifying': teamIndex < 2 }">
                {{ teamIndex + 1 }}
              </div>
              <div class="team-info">
                <span class="team-name">{{ team.tournament_name }}</span>
              </div>
              <div class="team-stats">
                <span class="stat">-</span>
                <span class="stat">-</span>
                <span class="stat points">-</span>
              </div>
            </div>
          </div>
          <div class="group-legend">
            <div class="legend-item qualifying">
              <span class="dot"></span>
              <span>Advances to Playoffs</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Playoffs Section -->
    <div class="playoffs-section">
      <h3 class="text-xl font-bold mb-6 section-title flex items-center gap-3">
        <span class="w-2 h-8 bg-purple-500 rounded"></span>
        Knockout Stage
      </h3>
      <PlayoffBracket :teams="playoffTeams" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type Team from "~/interfaces/teams/team";
import type Pools from "~/interfaces/pools/pools";
import PlayoffBracket from "~/components/tournament/PlayoffBracket.vue";
import { computed } from 'vue';

const props = defineProps<{
  teams: Array<Team>
  pools?: Array<Pools>
}>()

const groupedTeams = computed(() => {
  if (!props.pools || props.pools.length === 0) {
    // If no pools defined, create groups based on team count
    // For example, 32 teams = 8 groups of 4
    const teamCount = props.teams.length;
    if (teamCount === 0) return [];
    
    const groupCount = Math.max(2, Math.min(8, Math.ceil(teamCount / 4)));
    const teamsPerGroup = Math.ceil(teamCount / groupCount);
    
    const groups = [];
    for (let i = 0; i < groupCount; i++) {
      const groupTeams = props.teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
      if (groupTeams.length > 0) {
        groups.push({
          name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, D...
          teams: groupTeams
        });
      }
    }
    return groups;
  }
  
  return props.pools.map((pool, index) => {
    const poolTeams = props.teams.filter(team => team.pivot?.pool_id === pool.id);
    return {
      name: pool.name || `Group ${String.fromCharCode(65 + index)}`,
      teams: poolTeams.length > 0 ? poolTeams : props.teams.slice(index * 4, (index + 1) * 4)
    };
  }).filter(group => group.teams.length > 0);
})

// Top 2 teams from each group advance to playoffs
const playoffTeams = computed(() => {
  const topTeams: Team[] = [];
  
  groupedTeams.value.forEach(group => {
    const teamsToAdvance = Math.min(2, group.teams.length);
    topTeams.push(...group.teams.slice(0, teamsToAdvance));
  });
  
  if (topTeams.length === 0) {
    return props.teams;
  }
  
  return topTeams;
})
</script>

<style scoped>
/* Theme transition for smooth color mode switching */
.group-stage-wrapper,
.group-stage-wrapper * {
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-title {
  color: var(--color-text-primary);
}

.groups-section {
  @apply p-6 rounded-2xl;
  background: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
}

.group-card {
  @apply rounded-xl overflow-hidden;
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-default);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.group-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
}

.group-header {
  @apply py-4 px-5 text-center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.group-letter {
  @apply text-lg font-bold uppercase tracking-wider;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.group-teams {
  @apply p-3;
  background: var(--color-surface-default);
}

.team-row {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-default);
}

.team-row:hover {
  border-color: var(--color-border-light);
  background: var(--color-bg-hover);
}

.team-row.qualifying {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.04));
  border-color: rgba(34, 197, 94, 0.3);
}

.team-row.qualifying:hover {
  border-color: rgba(34, 197, 94, 0.5);
}

.position {
  @apply flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.position.qualifying {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.team-info {
  @apply flex-1;
}

.team-name {
  @apply text-sm font-medium truncate block;
  color: var(--color-text-primary);
}

.team-stats {
  @apply flex items-center gap-2;
}

.stat {
  @apply text-xs font-medium px-2 py-1 rounded;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  min-width: 28px;
  text-align: center;
}

.stat.points {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.group-legend {
  @apply px-4 py-3;
  border-top: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
}

.legend-item {
  @apply flex items-center gap-2 text-xs;
  color: var(--color-text-tertiary);
}

.legend-item .dot {
  @apply w-2 h-2 rounded-full;
  background: var(--color-bg-tertiary);
}

.legend-item.qualifying .dot {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
}

.playoffs-section {
  @apply p-6 rounded-2xl;
  background: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
}
</style>
