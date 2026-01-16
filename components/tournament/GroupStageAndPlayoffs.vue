<template>
  <div class="mt-6 group-stage-wrapper">
    <!-- Group Stage Section -->
    <div class="groups-section mb-12" v-if="groupedTeams.length > 0">
      <h3 class="text-xl font-bold mb-6 section-title flex items-center gap-3">
        <span class="w-2 h-8 bg-blue-500 rounded"></span>
        Group Stage
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
            v-for="(group, groupIndex) in groupedTeams" 
            :key="group.id || groupIndex" 
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
                :class="{ 'qualifying': teamIndex < (group.advancing_teams_count || 2) }"
            >
              <div class="position" :class="{ 'qualifying': teamIndex < (group.advancing_teams_count || 2) }">
                {{ team.pivot?.position || teamIndex + 1 }}
              </div>
              <div class="team-info">
                <span class="team-name">{{ team.tournament_name || team.local_name || 'TBD' }}</span>
              </div>
              <div class="team-stats">
                <span class="stat" :title="'Wins'">{{ team.wins ?? team.pivot?.wins ?? '-' }}</span>
                <span class="stat" :title="'Losses'">{{ team.losses ?? team.pivot?.losses ?? '-' }}</span>
                <span class="stat points" :title="'Points'">{{ team.points ?? team.pivot?.points ?? '-' }}</span>
              </div>
            </div>
            <!-- Show placeholders if no teams yet -->
            <template v-if="group.teams.length === 0">
              <div 
                  v-for="i in (group.teams_count || 4)" 
                  :key="'placeholder-'+i"
                  class="team-row placeholder"
              >
                <div class="position">{{ i }}</div>
                <div class="team-info">
                  <span class="team-name text-gray-400">TBD</span>
                </div>
                <div class="team-stats">
                  <span class="stat">-</span>
                  <span class="stat">-</span>
                  <span class="stat points">-</span>
                </div>
              </div>
            </template>
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
      <PlayoffBracket :teams="playoffTeams" :matches="playoffMatches" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type Team from "~/interfaces/teams/team";
import PlayoffBracket from "~/components/tournament/PlayoffBracket.vue";
import { computed } from 'vue';

interface TournamentGroup {
  id: number
  name: string
  group_number: number
  teams_count: number
  games_between: number
  advancing_teams_count: number
  teams: Array<Team>
  matches?: Array<any>
}

interface TeamWithStats extends Team {
  played?: number
  wins?: number
  draws?: number
  losses?: number
  goals_for?: number
  goals_against?: number
  goal_difference?: number
  points?: number
}

const props = defineProps<{
  teams: Array<Team>
  groups?: Array<TournamentGroup>
  matches?: Array<any>
}>()

// Calculate team standings from matches
function calculateStandings(teams: Array<Team>, matches: Array<any> = []): Array<TeamWithStats> {
  const standingsMap = new Map<number, TeamWithStats>()
  
  // Initialize standings for all teams
  teams.forEach(team => {
    standingsMap.set(team.id, {
      ...team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0
    })
  })
  
  // Process matches to calculate standings
  matches.forEach(match => {
    const homeId = match.team_id_home
    const awayId = match.team_id_away
    const homeScore = match.points_home
    const awayScore = match.points_away
    
    // Skip matches without scores or teams
    if (homeId === null || awayId === null || homeScore === null || awayScore === null) {
      return
    }
    
    const homeStanding = standingsMap.get(homeId)
    const awayStanding = standingsMap.get(awayId)
    
    if (homeStanding) {
      homeStanding.played = (homeStanding.played || 0) + 1
      homeStanding.goals_for = (homeStanding.goals_for || 0) + homeScore
      homeStanding.goals_against = (homeStanding.goals_against || 0) + awayScore
      
      if (homeScore > awayScore) {
        homeStanding.wins = (homeStanding.wins || 0) + 1
        homeStanding.points = (homeStanding.points || 0) + 3
      } else if (homeScore === awayScore) {
        homeStanding.draws = (homeStanding.draws || 0) + 1
        homeStanding.points = (homeStanding.points || 0) + 1
      } else {
        homeStanding.losses = (homeStanding.losses || 0) + 1
      }
    }
    
    if (awayStanding) {
      awayStanding.played = (awayStanding.played || 0) + 1
      awayStanding.goals_for = (awayStanding.goals_for || 0) + awayScore
      awayStanding.goals_against = (awayStanding.goals_against || 0) + homeScore
      
      if (awayScore > homeScore) {
        awayStanding.wins = (awayStanding.wins || 0) + 1
        awayStanding.points = (awayStanding.points || 0) + 3
      } else if (awayScore === homeScore) {
        awayStanding.draws = (awayStanding.draws || 0) + 1
        awayStanding.points = (awayStanding.points || 0) + 1
      } else {
        awayStanding.losses = (awayStanding.losses || 0) + 1
      }
    }
  })
  
  // Calculate goal difference
  standingsMap.forEach(standing => {
    standing.goal_difference = (standing.goals_for || 0) - (standing.goals_against || 0)
  })
  
  // Sort by points, then goal difference, then goals for
  return Array.from(standingsMap.values()).sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0)
    if ((b.goal_difference || 0) !== (a.goal_difference || 0)) return (b.goal_difference || 0) - (a.goal_difference || 0)
    return (b.goals_for || 0) - (a.goals_for || 0)
  })
}

const groupedTeams = computed(() => {
  // Use actual tournament groups if available
  if (props.groups && props.groups.length > 0) {
    return props.groups.map(group => {
      // Calculate standings from group matches
      const teamsWithStats = calculateStandings(group.teams || [], group.matches || [])
      
      return {
        id: group.id,
        name: group.name,
        teams_count: group.teams_count,
        advancing_teams_count: group.advancing_teams_count,
        teams: teamsWithStats
      }
    });
  }
  
  // Fallback: create groups based on team count if no groups defined
  const teamCount = props.teams.length;
  if (teamCount === 0) return [];
  
  const groupCount = Math.max(2, Math.min(8, Math.ceil(teamCount / 4)));
  const teamsPerGroup = Math.ceil(teamCount / groupCount);
  
  const groups = [];
  for (let i = 0; i < groupCount; i++) {
    const groupTeams = props.teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
    if (groupTeams.length > 0) {
      groups.push({
        id: i,
        name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, D...
        teams_count: teamsPerGroup,
        advancing_teams_count: 2,
        teams: groupTeams as TeamWithStats[]
      });
    }
  }
  return groups;
})

// Filter playoff matches (those with round_number set, no group_id or group_id is for linking)
const playoffMatches = computed(() => {
  if (!props.matches) return [];
  // Playoff matches have round_number set
  return props.matches.filter(m => m.round_number !== null && m.round_number !== undefined);
})

// Teams that advance to playoffs - based on group standings
const playoffTeams = computed(() => {
  const topTeams: Team[] = [];
  
  groupedTeams.value.forEach(group => {
    const advancingCount = group.advancing_teams_count || 2;
    // Only add teams that actually exist (not placeholders)
    const teamsToAdvance = group.teams.slice(0, advancingCount);
    topTeams.push(...teamsToAdvance);
  });
  
  // If no teams have advanced yet (group stage not complete), return empty
  // This will show TBD in the bracket
  if (topTeams.length === 0) {
    return [];
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
