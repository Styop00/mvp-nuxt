<template>
  <div class="mt-6 league-table-wrapper">
    <h3 class="text-xl font-bold mb-6 table-title flex items-center gap-3">
      <span class="w-2 h-8 bg-blue-500 rounded"></span>
      League Standings
    </h3>
    <div class="league-table-container p-6 rounded-2xl">
      <div class="overflow-x-auto">
        <table class="league-table w-full">
          <thead>
            <tr>
              <th class="pos">#</th>
              <th class="team">Team</th>
              <th class="stat">P</th>
              <th class="stat">W</th>
              <th class="stat">D</th>
              <th class="stat">L</th>
              <th class="stat">GF</th>
              <th class="stat">GA</th>
              <th class="stat gd">GD</th>
              <th class="stat pts">PTS</th>
            </tr>
          </thead>
          <tbody>
            <tr 
                v-for="(team, index) in teams" 
                :key="team.id"
                :class="getRowClass(index)"
            >
              <td class="pos">
                <span class="position-badge" :class="getPositionClass(index)">{{ index + 1 }}</span>
              </td>
              <td class="team">
                <div class="team-info">
                  <span class="team-name">{{ team.tournament_name }}</span>
                </div>
              </td>
              <td class="stat">-</td>
              <td class="stat">-</td>
              <td class="stat">-</td>
              <td class="stat">-</td>
              <td class="stat">-</td>
              <td class="stat">-</td>
              <td class="stat gd">-</td>
              <td class="stat pts">-</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Legend -->
      <div class="legend mt-6">
        <div class="legend-item champion">
          <span class="legend-color"></span>
          <span>Champion / Promotion Zone</span>
        </div>
        <div class="legend-item playoffs">
          <span class="legend-color"></span>
          <span>Playoff Zone</span>
        </div>
        <div class="legend-item relegation">
          <span class="legend-color"></span>
          <span>Relegation Zone</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Team from "~/interfaces/teams/team";

const props = defineProps<{
  teams: Array<Team>
}>()

function getRowClass(index: number): string {
  const totalTeams = props.teams.length;
  
  // Champion zone (top 1-3)
  if (index < 1) return 'champion';
  if (index < 3) return 'promotion';
  
  // Playoff zone (next few teams)
  if (index < Math.min(6, Math.floor(totalTeams * 0.4))) return 'playoffs';
  
  // Relegation zone (bottom 3)
  if (index >= totalTeams - 3) return 'relegation';
  
  return '';
}

function getPositionClass(index: number): string {
  const totalTeams = props.teams.length;
  
  if (index === 0) return 'gold';
  if (index === 1) return 'silver';
  if (index === 2) return 'bronze';
  if (index >= totalTeams - 3) return 'danger';
  
  return '';
}
</script>

<style scoped>
/* Theme transition for smooth color mode switching */
.league-table-wrapper,
.league-table-wrapper * {
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-title {
  color: var(--color-text-primary);
}

.league-table-container {
  background: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
}

.league-table {
  border-collapse: separate;
  border-spacing: 0;
}

.league-table thead tr {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.league-table th {
  @apply py-4 px-3 text-xs font-bold uppercase tracking-wider text-white;
  text-align: center;
}

.league-table th.pos {
  @apply rounded-tl-lg;
  width: 50px;
}

.league-table th.team {
  text-align: left;
  min-width: 200px;
}

.league-table th.stat {
  width: 50px;
}

.league-table th.gd {
  background: rgba(0,0,0,0.1);
}

.league-table th.pts {
  @apply rounded-tr-lg;
  background: rgba(0,0,0,0.2);
  width: 60px;
}

.league-table tbody tr {
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border-default);
}

.league-table tbody tr:hover {
  background: var(--color-bg-hover);
}

.league-table tbody tr.champion {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.12), rgba(251, 191, 36, 0.04));
  border-left: 4px solid #fbbf24;
}

.league-table tbody tr.promotion {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.04));
  border-left: 4px solid #22c55e;
}

.league-table tbody tr.playoffs {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.04));
  border-left: 4px solid #3b82f6;
}

.league-table tbody tr.relegation {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.04));
  border-left: 4px solid #ef4444;
}

.league-table td {
  @apply py-3 px-3;
  color: var(--color-text-primary);
  text-align: center;
}

.league-table td.team {
  text-align: left;
}

.league-table td.pos {
  padding-left: 16px;
}

.league-table td.stat {
  @apply text-sm font-medium;
  color: var(--color-text-tertiary);
}

.league-table td.gd {
  background: rgba(0,0,0,0.03);
  color: var(--color-text-primary);
}

.league-table td.pts {
  @apply font-bold;
  background: rgba(0,0,0,0.05);
  color: #d97706;
}

.position-badge {
  @apply inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.position-badge.gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #451a03;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
}

.position-badge.silver {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: #1f2937;
  box-shadow: 0 0 12px rgba(156, 163, 175, 0.4);
}

.position-badge.bronze {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
  box-shadow: 0 0 12px rgba(217, 119, 6, 0.4);
}

.position-badge.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
}

.team-info {
  @apply flex items-center gap-3;
}

.team-name {
  @apply text-sm font-medium;
  color: var(--color-text-primary);
}

.legend {
  @apply flex flex-wrap gap-6 pt-4;
  border-top: 1px solid var(--color-border-default);
}

.legend-item {
  @apply flex items-center gap-2 text-xs;
  color: var(--color-text-tertiary);
}

.legend-color {
  @apply w-4 h-4 rounded;
}

.legend-item.champion .legend-color {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.legend-item.playoffs .legend-color {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.legend-item.relegation .legend-color {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
</style>
