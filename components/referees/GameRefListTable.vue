<template>
  <div
    v-if="referees && referees.length"
    class="bg-dark-surface-default min-h-96 flex flex-col gap-4 p-4 items-center w-full rounded-lg"
  >
    <div class="flex w-full items-start px-2">
      <p
        class="text-base font-bold py-4 flex items-center justify-start tracking-widest"
      >
        <span
          class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-red-500/50 to-pink-500/50 mr-3"
        />
        Judge List
      </p>
    </div>
    <!-- Scrollable table container -->
    <div class="overflow-auto w-full text-[12px]">
      <table class="table-auto w-full border border-dark-border-default">
        <thead class="bg-dark-surface-elevated">
          <tr>
            <th class="px-4 py-2">License</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2 sm:table-cell">Prio</th>
            <th class="px-4 py-2">Games in Week</th>
            <th class="px-4 py-2 md:table-cell">Max Possible Games</th>
            <th class="px-4 py-2 lg:table-cell">Mon</th>
            <th class="px-4 py-2 lg:table-cell">Tue</th>
            <th class="px-4 py-2 lg:table-cell">Wed</th>
            <th class="px-4 py-2 lg:table-cell">Thu</th>
            <th class="px-4 py-2 lg:table-cell">Fri</th>
            <th class="px-4 py-2 lg:table-cell">Sat</th>
            <th class="px-4 py-2 lg:table-cell">Sun</th>
            <th v-if="props.gameId" class="px-4 py-2 lg:table-cell">Distance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ref in props.referees" :key="ref.id">
            <td class="border px-4 py-2">{{ ref.license }}</td>
            <td class="border px-4 py-2">
              {{ ref.user?.name || "N/A" }}
            </td>
            <td class="border px-4 py-2 hidden sm:table-cell">
              {{ ref.prio }}/{{ ref.maxStarRating }}
              {{ ref.mentor ? " M" : ""


              }}{{ ref.prospect ? " P" : "" }}
            </td>
            <td class="border px-4 py-2">{{ ref.gameInWeek }}</td>
            <td class="border px-4 py-2 hidden md:table-cell">
              {{ ref.gameInWeek }}/{{ ref.maxPossibleGamesWeek }}
            </td>
            <!-- Days -->
            <template v-for="i in 7">
              <td
                v-if="i <= 7"
                class="border px-4 py-2  lg:table-cell"
                :class="getDayClass(ref.days[`day${i}`])"
              >
                {{ formatDay(ref.days[`day${i}`]) }}
              </td>
            </template>
            <td>{{ (ref.distance/1000).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RefereeGetRefList } from '~/interfaces/referees/referee';

const props = defineProps<{referees: RefereeGetRefList[], gameId: number}>()

function formatDay(day: any) {
  if (!day || day.available === null) return "N/A";
  if (!day.available) return "Unavailable";
  if (day.games && day.games.length > 0) return `${day.games.length} Game(s)`;
  return "Available";
}

function getDayClass(day: any) {
  if (!day || day.available === null) return "bg-gray-100 text-dark-text-secondary";
  if (!day.available) return "bg-red-100 text-red-500";
  if (day.games && day.games.length > 0) return "bg-yellow-100 text-yellow-500";
  return "bg-green-100 text-green-500";
}
</script>
