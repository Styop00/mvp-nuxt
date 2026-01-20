<template>
  <div class="mt-6 playoff-bracket-wrapper">
    <h3 class="text-xl font-bold mb-4 bracket-title">Playoff Bracket</h3>
    <div class="overflow-x-auto pb-4">
      <div class="bracket-container min-w-max p-8 rounded-2xl relative">
        <!-- Background Grid Pattern -->
        <div class="bracket-bg"></div>

        <div class="flex items-stretch justify-center relative z-10">
          <!-- LEFT BRACKET -->
          <div class="flex items-center">
            <template v-for="(round, roundIdx) in leftRounds" :key="'left-' + roundIdx">
              <div class="round-column">
                <div class="round-header left" :class="{ semi: round.isSemiFinal }">
                  <span>{{ round.name }}</span>
                </div>
                <div
                    class="matches-container"
                    :class="{
                      spaced: roundIdx > 0,
                      centered: round.isSemiFinal
                    }"
                    :style="{ gap: `${20 * Math.pow(2, roundIdx)}px` }"
                >
                  <div
                      v-for="(match, matchIdx) in round.matches"
                      :key="'lm-' + roundIdx + '-' + matchIdx"
                      class="match-wrapper"
                  >
                    <div class="match-box" :class="{ semi: round.isSemiFinal }">
                      <div class="team-row top" :class="{ winner: match.winner === 1, 'has-team': match.team1 }">
                        <span class="seed">{{ match.seed1 || '-' }}</span>
                        <span class="name">{{ match.team1 || 'TBD' }}</span>
                        <span class="score">{{ match.score1 ?? '-' }}</span>
                      </div>
                      <div class="team-row bottom" :class="{ winner: match.winner === 2, 'has-team': match.team2 }">
                        <span class="seed">{{ match.seed2 || '-' }}</span>
                        <span class="name">{{ match.team2 || 'TBD' }}</span>
                        <span class="score">{{ match.score2 ?? '-' }}</span>
                      </div>
                    </div>
                    <div
                        class="connector-h-right"
                        :class="{ final: round.isSemiFinal }"
                        v-if="roundIdx < leftRounds.length - 1 || round.isSemiFinal"
                    ></div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- CENTER - FINAL & CHAMPION -->
          <div class="final-column">
            <!-- Trophy -->
            <div class="trophy-container">
              <div class="trophy-icon">🏆</div>
              <div class="trophy-label">CHAMPION</div>
              <div class="champion-name">{{ champion || 'TBD' }}</div>
            </div>

            <!-- Final Match -->
            <div class="final-match-container">
              <div class="final-header">FINAL</div>
              <div class="final-match-box">
                <div class="final-team left-finalist"
                     :class="{ winner: finalMatch.winner === 1, 'has-team': finalMatch.team1 }">
                  <span class="name">{{ finalMatch.team1 || 'TBD' }}</span>
                  <span class="score">{{ finalMatch.score1 ?? '-' }}</span>
                </div>
                <div class="vs-divider">
                  <span>VS</span>
                </div>
                <div class="final-team right-finalist"
                     :class="{ winner: finalMatch.winner === 2, 'has-team': finalMatch.team2 }">
                  <span class="score">{{ finalMatch.score2 ?? '-' }}</span>
                  <span class="name">{{ finalMatch.team2 || 'TBD' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT BRACKET (Mirrored - starts from right edge) -->
          <div class="flex items-center flex-row-reverse">
            <template v-for="(round, roundIdx) in rightRounds" :key="'right-' + roundIdx">
              <div class="round-column">
                <div class="round-header right" :class="{ semi: round.isSemiFinal }">
                  <span>{{ round.name }}</span>
                </div>
                <div
                    class="matches-container"
                    :class="{ 
                      spaced: roundIdx > 0, 
                      centered: round.isSemiFinal 
                    }"
                    :style="{ gap: `${20 * Math.pow(2, roundIdx)}px` }"
                >
                  <div
                      v-for="(match, matchIdx) in round.matches"
                      :key="'rm-' + roundIdx + '-' + matchIdx"
                      class="match-wrapper"
                  >
                    <div
                        class="connector-h-left"
                        :class="{ final: round.isSemiFinal }"
                        v-if="roundIdx < rightRounds.length - 1 || round.isSemiFinal"
                    ></div>
                    <div class="match-box right-side" :class="{ semi: round.isSemiFinal }">
                      <div class="team-row top right" :class="{ winner: match.winner === 1, 'has-team': match.team1 }">
                        <span class="seed">{{ match.seed1 || '-' }}</span>
                        <span class="name">{{ match.team1 || 'TBD' }}</span>
                        <span class="score">{{ match.score1 ?? '-' }}</span>
                      </div>
                      <div class="team-row bottom right"
                           :class="{ winner: match.winner === 2, 'has-team': match.team2 }">
                        <span class="seed">{{ match.seed2 || '-' }}</span>
                        <span class="name">{{ match.team2 || 'TBD' }}</span>
                        <span class="score">{{ match.score2 ?? '-' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Team from "~/interfaces/teams/team";
import {computed} from 'vue';
import type Tournament from "~/interfaces/tournament/tournament";

interface Match {
  team1: string | null;
  team2: string | null;
  seed1?: number;
  seed2?: number;
  score1: number | null;
  score2: number | null;
  winner: number | null;
  _matchNumber?: number; // Internal: for sorting within sides
}

interface Round {
  name: string;
  matches: Match[];
  isSemiFinal: boolean;
}

const props = defineProps<{
  teams: Array<Team>
  matches?: Array<Match>
  tournament: Tournament
}>()

function getRoundName(totalTeamsInRound: number): string {
  if (totalTeamsInRound === 2) return 'FINAL';
  if (totalTeamsInRound === 4) return 'SEMI-FINAL';
  if (totalTeamsInRound === 8) return 'QUARTER-FINAL';
  if (totalTeamsInRound === 16) return 'ROUND OF 16';
  if (totalTeamsInRound === 32) return 'ROUND OF 32';
  if (totalTeamsInRound === 64) return 'ROUND OF 64';
  return `ROUND OF ${totalTeamsInRound}`;
}

function createMatch(team1?: Team, team2?: Team, seed1?: number, seed2?: number): Match {
  return {
    team1: team1?.tournament_name as string || null,
    team2: team2?.tournament_name as string || null,
    seed1,
    seed2,
    score1: null,
    score2: null,
    winner: null
  };
}

// Process actual matches from backend
function processMatches(matches: Array<any>): { leftRounds: Round[], rightRounds: Round[], finalMatch: Match } {
  if (!matches || matches.length === 0) {
    // Fallback to team-based generation if no matches
    return {
      leftRounds: generateBracketRounds(leftTeams.value, 0),
      rightRounds: generateBracketRounds(rightTeams.value, Math.ceil(props.teams.length / 2)),
      finalMatch: createMatch()
    }
  }

  const matchupsByRound = new Map<number, Map<number, Array<any>>>()

  matches.forEach(match => {
    const roundNum = match.round_number || 0
    const matchupNum = match.match_number || 0

    if (!matchupsByRound.has(roundNum)) {
      matchupsByRound.set(roundNum, new Map())
    }
    const roundMatchups = matchupsByRound.get(roundNum)!

    if (!roundMatchups.has(matchupNum)) {
      roundMatchups.set(matchupNum, [])
    }
    roundMatchups.get(matchupNum)!.push(match)
  })

  const sortedRounds = Array.from(matchupsByRound.keys()).sort((a, b) => a - b)
  const finalRoundNum = sortedRounds[sortedRounds.length - 1]

  // Find final matchup (from the highest round number)
  const finalRoundMatchups = matchupsByRound.get(finalRoundNum)
  const finalMatchupGames = finalRoundMatchups?.get(1) || [] // Final should have matchup 1
  const finalMatchData = finalMatchupGames[0] // First game of the final matchup

  // Helper to get team name from match data
  const getTeamName = (match: any, isHome: boolean): string | null => {
    const teamIdField = isHome ? 'team_id_home' : 'team_id_away'
    const teamField = isHome ? 'home_team' : 'guest_team'
    const teamFieldAlt = isHome ? 'homeTeam' : 'guestTeam'

    const team = match[teamField] || match[teamFieldAlt] ||
        (match[teamIdField] ? props.teams.find(t => t.id === match[teamIdField]) : null)

    if (!team && !match[teamIdField]) {
      return null // Teams not yet determined (TBD)
    }

    return team?.tournament_name || team?.name || null
  }

  // Calculate aggregate score for a matchup (sum of all games)
  const calculateAggregateScore = (games: Array<any>): { team1Total: number, team2Total: number } => {
    let team1Total = 0
    let team2Total = 0

    games.forEach((game, idx) => {
      const homeScore = game.points_home ?? 0
      const awayScore = game.points_away ?? 0

      // For odd games (1, 3, 5...), team1 is home; for even games (2, 4...), team1 is away
      if (idx % 2 === 0) {
        team1Total += homeScore
        team2Total += awayScore
      } else {
        team1Total += awayScore
        team2Total += homeScore
      }
    })

    return {team1Total, team2Total}
  }

  const finalMatch: Match = finalMatchData ? {
    team1: getTeamName(finalMatchData, true),
    team2: getTeamName(finalMatchData, false),
    seed1: null,
    seed2: null,
    score1: finalMatchupGames.length > 0 ? calculateAggregateScore(finalMatchupGames).team1Total : null,
    score2: finalMatchupGames.length > 0 ? calculateAggregateScore(finalMatchupGames).team2Total : null,
    winner: finalMatchData.team_id_winner ?
        (finalMatchData.team_id_winner === finalMatchData.team_id_home ? 1 : 2) : null
  } : createMatch()

  // Separate left and right bracket matchups
  const leftRounds: Round[] = []
  const rightRounds: Round[] = []

  // Process each round (excluding final)
  sortedRounds.forEach(roundNum => {
    const roundMatchups = matchupsByRound.get(roundNum)
    if (!roundMatchups || roundMatchups.size === 0) return

    // Check if this is the final round
    const firstMatchup = roundMatchups.get(1)
    if (firstMatchup && firstMatchup[0]?.is_final) return // Skip final (handled separately)

    // Get sorted matchup numbers
    const sortedMatchups = Array.from(roundMatchups.keys()).sort((a, b) => a - b)

    // Determine if this is semi-final (2 matchups in this round)
    const isSemiFinal = sortedMatchups.length === 2 && roundNum === finalRoundNum - 1

    // Split matchups into left and right based on side field
    const leftMatches: Match[] = []
    const rightMatches: Match[] = []

    sortedMatchups.forEach((matchupNum) => {
      const matchupGames = roundMatchups.get(matchupNum) || []
      const firstGame = matchupGames[0]

      if (!firstGame) return

      // Get side from first game (all games in matchup have same side)
      const side = firstGame.side

      // Skip if side is null (shouldn't happen for non-final rounds, but just in case)
      if (side === null) return

      const {team1Total, team2Total} = calculateAggregateScore(matchupGames)

      // Check if any game has scores (to show aggregate)
      const hasScores = matchupGames.some(g => g.points_home !== null || g.points_away !== null)

      const matchData: Match = {
        team1: getTeamName(firstGame, true),
        team2: getTeamName(firstGame, false),
        seed1: null,
        seed2: null,
        score1: hasScores ? team1Total : null,
        score2: hasScores ? team2Total : null,
        winner: firstGame.team_id_winner ?
            (firstGame.team_id_winner === firstGame.team_id_home ? 1 : 2) : null,
        _matchNumber: matchupNum // Store match_number for sorting
      }

      // Split by side field: 'left' goes to leftMatches, 'right' goes to rightMatches
      if (side === 'left') {
        leftMatches.push(matchData)
      } else if (side === 'right') {
        rightMatches.push(matchData)
      }
    })

    // Sort left and right matches by match_number to maintain order within each side
    leftMatches.sort((a, b) => (a._matchNumber || 0) - (b._matchNumber || 0))
    rightMatches.sort((a, b) => (a._matchNumber || 0) - (b._matchNumber || 0))

    const roundName = roundMatchups.get(sortedMatchups[0])?.[0]?.round_name || getRoundName(sortedMatchups.length * 2)

    if (leftMatches.length > 0) {
      leftRounds.push({
        name: roundName,
        matches: leftMatches,
        isSemiFinal
      })
    }

    if (rightMatches.length > 0) {
      rightRounds.push({
        name: roundName,
        matches: rightMatches,
        isSemiFinal
      })
    }
  })

  return {leftRounds, rightRounds, finalMatch}
}

// Calculate bracket rounds dynamically (fallback when no matches)
function generateBracketRounds(teams?: Team[], seedOffset: number = 0): Round[] {
  const teamCount = teams?.length;
  if (!teamCount) return [];

  // Calculate number of rounds needed (excluding final)
  const rounds: Round[] = [];

  // First round - populate with actual teams
  const firstRoundMatches: Match[] = [];
  for (let i = 0; i < teamCount; i += 2) {
    firstRoundMatches.push(createMatch(
        teams[i],
        teams[i + 1],
        seedOffset + i + 1,
        teams[i + 1] ? seedOffset + i + 2 : undefined
    ));
  }

  // Total teams in this bracket side * 2 (for both sides) gives round name
  const totalTeamsInTournament = teamCount * 2;

  rounds.push({
    name: getRoundName(totalTeamsInTournament),
    matches: firstRoundMatches,
    isSemiFinal: totalTeamsInTournament === 4
  });

  // Generate subsequent rounds (empty matches - TBD)
  let currentMatchCount = Math.ceil(firstRoundMatches.length / 2);
  let currentTotalTeams = totalTeamsInTournament / 2;

  while (currentMatchCount >= 1 && currentTotalTeams > 2) {
    const roundMatches: Match[] = [];
    for (let i = 0; i < currentMatchCount; i++) {
      roundMatches.push(createMatch());
    }

    rounds.push({
      name: getRoundName(currentTotalTeams),
      matches: roundMatches,
      isSemiFinal: currentTotalTeams === 4
    });

    currentMatchCount = Math.ceil(currentMatchCount / 2);
    currentTotalTeams = currentTotalTeams / 2;
  }

  return rounds;
}

// Split teams into left and right brackets
const leftTeams = computed(() => {
  const half = Math.ceil(props.teams.length / 2);
  return props.teams.slice(0, half);
})

const rightTeams = computed(() => {
  const half = Math.ceil(props.teams.length / 2);
  return props.teams.slice(half);
})

// Process matches to build bracket
const bracketData = computed(() => {
  if (props.matches && props.matches.length > 0) {
    return processMatches(props.matches)
  }
  // Fallback to team-based generation
  return {
    leftRounds: generateBracketRounds(leftTeams.value, 0),
    rightRounds: generateBracketRounds(rightTeams.value, Math.ceil(props.teams.length / 2)),
    finalMatch: createMatch()
  }
})

const leftRounds = computed((): Round[] => {
  return bracketData.value.leftRounds
})

const rightRounds = computed((): Round[] => {
  return bracketData.value.rightRounds
})

const finalMatch = computed((): Match => {
  return bracketData.value.finalMatch
})

const champion = computed(() => {
  if (finalMatch.value.winner === 1) {
    return finalMatch.value.team1
  } else if (finalMatch.value.winner === 2) {
    return finalMatch.value.team2
  }
  return null
})
</script>

<style scoped>
/* Theme transition for smooth color mode switching */
.playoff-bracket-wrapper,
.playoff-bracket-wrapper * {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bracket-title {
  color: var(--color-text-primary);
}

.bracket-container {
  background: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
  position: relative;
  overflow: hidden;
}

.bracket-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
}

.round-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  position: relative;
  padding: 0 10px;
}

.round-header {
  @apply text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-lg mb-4;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.round-header.semi {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.matches-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex: 1;
}

.matches-container.centered {
  justify-content: center;
}

.match-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.match-wrapper.flex-row-reverse {
  flex-direction: row-reverse;
}

.match-box {
  @apply rounded-lg overflow-hidden;
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-default);
  min-width: 180px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.match-box:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
  transform: scale(1.02);
}

.match-box.semi {
  min-width: 200px;
  border-color: #8b5cf6;
}

.match-box.semi:hover {
  border-color: #a78bfa;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
}

.team-row {
  @apply flex items-center px-3 py-2.5;
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-surface-default);
}

.team-row.bottom {
  border-bottom: none;
}

.team-row.has-team {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), var(--color-surface-default));
}

.team-row.winner {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
}

.team-row .seed {
  @apply text-xs font-bold rounded px-1.5 py-0.5 mr-2;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  min-width: 24px;
  text-align: center;
}

.team-row.winner .seed {
  background: #22c55e;
  color: white;
}

.team-row .name {
  @apply flex-1 text-sm font-medium truncate;
  color: var(--color-text-primary);
}

.team-row .score {
  @apply text-sm font-bold ml-2 px-2 py-0.5 rounded;
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  min-width: 28px;
  text-align: center;
}

.team-row.winner .score {
  background: #22c55e;
  color: white;
}

/* Right side bracket - mirrored layout */
.match-box.right-side .team-row {
  flex-direction: row-reverse;
}

.match-box.right-side .team-row .seed {
  @apply mr-0 ml-2;
}

.match-box.right-side .team-row .score {
  @apply ml-0 mr-2;
}

.match-box.right-side .team-row.has-team {
  background: linear-gradient(270deg, rgba(59, 130, 246, 0.1), var(--color-surface-default));
}

.match-box.right-side .team-row.winner {
  background: linear-gradient(270deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
}

/* Connectors */
.connector-h-right {
  width: 30px;
  height: 2px;
  background: var(--color-border-light);
  position: relative;
  flex-shrink: 0;
}

.connector-h-right.final {
  width: 40px;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}

.connector-h-left {
  width: 30px;
  height: 2px;
  background: var(--color-border-light);
  position: relative;
  flex-shrink: 0;
}

.connector-h-left.final {
  width: 40px;
  background: linear-gradient(90deg, #a78bfa, #8b5cf6);
}

/* Final Column */
.final-column {
  @apply flex flex-col items-center justify-center mx-8;
  min-width: 200px;
}

.trophy-container {
  @apply flex flex-col items-center p-6 rounded-2xl mb-6;
  background: linear-gradient(145deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.4);
  border: 3px solid #fcd34d;
}

.trophy-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.trophy-label {
  @apply text-xs font-bold uppercase tracking-wider mt-2;
  color: #78350f;
}

.champion-name {
  @apply text-lg font-bold mt-1;
  color: #451a03;
}

.final-match-container {
  @apply p-4 rounded-xl;
  background: var(--color-surface-elevated);
  border: 3px solid #f59e0b;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.final-header {
  @apply text-center text-sm font-bold uppercase tracking-wider mb-3;
  color: #f59e0b;
}

.final-match-box {
  @apply flex items-center gap-3;
}

.final-team {
  @apply flex items-center gap-2 px-4 py-3 rounded-lg flex-1;
  background: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
}

.final-team.has-team {
  border-color: #3b82f6;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.1), var(--color-surface-default));
}

.final-team.winner {
  border-color: #22c55e;
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.15), var(--color-surface-default));
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

.final-team .name {
  @apply text-sm font-semibold flex-1;
  color: var(--color-text-primary);
}

.final-team .score {
  @apply text-sm font-bold px-2 py-1 rounded;
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.final-team.winner .score {
  background: #22c55e;
  color: white;
}

.left-finalist {
  flex-direction: row;
}

.right-finalist {
  flex-direction: row-reverse;
}

.vs-divider {
  @apply flex items-center justify-center w-10 h-10 rounded-full;
  background: linear-gradient(145deg, #f59e0b, #d97706);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.vs-divider span {
  @apply text-xs font-bold;
  color: #451a03;
}
</style>
