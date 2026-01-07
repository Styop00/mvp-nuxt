<template>
  <div>
    <div class="py-2 lg:p-6">
      <div class="rounded-lg overflow-hidden pb-4">
        <div>
          <Breadcrumb/>

          <h2 class="text-[30px] text-gray-600 font-medium tracking-wider flex items-center gap-3">
            Match #{{ game?.number }} in {{ game?.tournament?.alias }} <span class="text-base" v-html="gameStatus"/>
          </h2>
          <div class="bg-white mt-4 border border-gray-200 rounded-2xl overflow-hidden">
            <p class="border-b text-lg p-4 flex items-center font-medium">
              <span
                  class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
              />
              {{ game.homeTeam?.tournamentName }} - {{ game.guestTeam?.tournamentName }}
            </p>
            <div class="p-4 leading-8">
              <p>
                <span v-html="gameDate"/>
                <span class="ml-3" v-html="location"/>
              </p>
              <p class="text-brand-gray">
                Original date: {{ moment(game?.originalTermDate).format('DD-MMM-YYYY') }}
              </p>
              <p class="text-brand-gray">
                Organizer Club: {{ organizerClub }}
              </p>
              <div class="flex items-center gap-4 my-3">
                <BaseButton
                    class="bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 !px-4 !py-2 rounded-md text-sm"
                    @onClick="() => showConfirmPostponeModal = true"
                    v-if="userStore.isAdmin"
                >
                  Postpone the match
                </BaseButton>
                <BaseButton
                    class="bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 !px-4 !py-2 rounded-md text-sm"
                    @onClick="deleteMatch"
                    v-if="userStore.isAdmin"
                >
                  Delete Game
                </BaseButton>
                <BaseButton class="!px-4 !py-2 rounded-md text-sm"
                            @onClick="changeHomeAwayTeams"
                            v-if="userStore.isAdmin"
                >
                  Change Away/Home
                </BaseButton>
                <BaseButton class="!px-4 !py-2 rounded-md text-sm"
                            @onClick="setGameResult"
                            v-if="userStore.isAdmin"
                >
                  Set Result
                </BaseButton>
                <BaseButton class="!px-4 !py-2 rounded-md text-sm"
                            @onClick="setRightTime"
                            v-if="canSetTime"
                >
                  Set Date/Court
                </BaseButton>
                <BaseButton class="!px-4 !py-2 rounded-md text-sm" @onClick="setOrganizerClub" v-if="userStore.isAdmin">
                  Set Organizer Club
                </BaseButton>
                <BaseButton
                    class="!px-4 !py-2 rounded-md text-sm"
                    @onClick="() => showCancelGameModal = true"
                    v-if="canRejectSuggestion && (game?.statusId ? game?.statusId : 0) >= 1 && (game?.statusId ? game?.statusId : 0) <= 7"
                >
                  Postponement/Cancellation
                </BaseButton>
              </div>
            </div>
          </div>
          <template v-if="game.conflict">
            <GameConflicts
                :conflict="game.conflict"
                :home-team="game.homeTeam"
                :guest-team="game.guestTeam"
                @fetchConflict="fetchGame"/>
          </template>
          <template v-if="game.suggestion">
            <GameSuggestion
                :suggestion="game.suggestion"
                :can-accept="canAcceptSuggestion"
                :can-reject="canRejectSuggestion"
                @re-fetch="fetchGame"
            />
          </template>
          <template v-if="isCMHome || isCMGuest">
            <GameNotes
                :notes="game.notes"
                @re-fetch="fetchGame"
            />
          </template>
          <GameMessages
              v-if="game.id"
              :messages="game.messages"
              :home-team="game.homeTeam"
              :guest-team="game.guestTeam"
              :game-id="game.id"
              @re-fetch="fetchGame"
              :is-home-c-m-or-coach="isHomeCMOrCoach"
              :is-guest-c-m-or-coach="isGuestCMOrCoach"
          />
        </div>
      </div>
    </div>
    <ConfirmDeleteGameModal
        :game-id="gameId"
        v-model:visible="showDeleteModal"
        @deleted="fetchGame"
    />
    <ConfirmationModal
        v-model:visible="showConfirmPostponeModal"
        modal-body="Do you want to postpone the match so that the parties have to fix a new time?"
        @confirmed="postponeTheMatch"
    />
    <ConfirmCancelGameModal
        :game-id="gameId"
        v-model:visible="showCancelGameModal"
        @cancelled="fetchGame"
    />
    <template v-if="game?.id">
      <SetGameRightTimeModal :game="game" v-model:visible="showSetTimeModal" @updated="fetchGame"/>
      <SetGameResultModal :game="game" v-model:visible="showSetGameResult" @updated="fetchGame"/>
      <SetOrganizerClubModal :game="game" v-model:visible="showSetOrganizerModal" @updated="fetchGame"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import type Game from "~/interfaces/games/game";
import moment from "moment/moment";
import BaseButton from "~/components/buttons/BaseButton.vue";
import ConfirmDeleteGameModal from "~/components/modals/games/ConfirmDeleteGameModal.vue";
import SetGameRightTimeModal from "~/components/modals/games/SetGameRightTimeModal.vue";
import SetOrganizerClubModal from "~/components/modals/games/SetOrganizerClubModal.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import GameConflicts from "~/components/games/GameConflicts.vue";
import {useUserStore} from "~/store/user";
import GameSuggestion from "~/components/games/GameSuggestion.vue";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import ConfirmCancelGameModal from "~/components/modals/games/ConfirmCancelGameModal.vue";
import GameMessages from "~/components/games/GameMessages.vue";
import GameNotes from "~/components/games/GameNotes.vue";
import SetGameResultModal from "~/components/modals/games/SetGameResultModal.vue";

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const gameId = +route.params.gameId
const {fetchGameById, changeHomeAway, postponeMatch} = useGamesFetch()
const game = ref({} as Game)
const showDeleteModal = ref(false)
const showSetTimeModal = ref(false)
const showSetGameResult = ref(false)
const showSetOrganizerModal = ref(false)
const showConfirmPostponeModal = ref(false)
const showCancelGameModal = ref(false)

const gameDate = computed(() => {
  const date = game.value?.date ? `<span class="text-brand-gray">${moment(game.value?.date).format('ddd') + ' ' + moment(game.value?.date).format('DD-MMM-YYYY')}</span>` : '<span class="text-red-400"> date is missing </span>'
  const time = game.value?.time ? `<span class="text-brand-gray">${moment(game.value?.time, 'HH:mm').format('HH:mm')} </span>` : '<span class="text-red-400"> time is missing</span>'
  return date + ' ' + time
})

const location = computed(() => {
  const venue = game.value?.court?.venue ? `<span class="text-brand-gray">${game.value?.court?.venue.name}</span>` : '<span class="text-red-400"> venue is missing </span>'
  const court = game.value?.court ? `<span class="text-brand-gray">${game.value?.court.name}</span>` : '<span class="text-red-400"> court is missing</span>'
  return venue + ' - ' + court
})

const organizerClub = computed(() => {
  return game.value?.club?.name ? game.value?.club?.name : game.value?.homeTeam?.club?.name
})

async function deleteMatch() {
  showDeleteModal.value = true
}

async function changeHomeAwayTeams() {
  await changeHomeAway(+gameId)
  await fetchGame()
}

async function setRightTime() {
  showSetTimeModal.value = true
}

async function setGameResult() {
  showSetGameResult.value = true
}

async function setOrganizerClub() {
  showSetOrganizerModal.value = true
}

async function fetchGame() {
  showCancelGameModal.value = false
  showConfirmPostponeModal.value = false
  game.value = await fetchGameById(+gameId)

  if (!game.value.id) {
    router.back()
  }
}

async function postponeTheMatch() {
  await postponeMatch(+gameId, {});

  await fetchGame();
}

const gameStatus = computed(() => {
  let status = `<span  class="mx-2 bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Ok</span>`;
  if (game.value.isDeleted) {
    return `<span  class="mx-2 bg-red-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Deleted</span>`
  }
  switch (game.value.statusId) {
    case 1 :
      status = `<span  class="mx-2 bg-red-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Time missing</span>`;
      break;
    case 2 :
      status = `<span  class="mx-2 bg-red-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Venue missing</span>`;
      break;
    case 3 :
      status = `<span  class="mx-2 bg-yellow-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Must be moved</span>`;
      break;
    case 4 :
      status = `<span  class="mx-2 bg-amber-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Moving in progress</span>`;
      break;
    case 5 :
      status = `<span  class="mx-2 bg-amber-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Awaiting association</span>`;
      break;
    case 6 :
      status = `<span  class="mx-2 bg-indigo-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Awaiting sync</span>`;
      break;
    case 7 :
      status = `<span  class="mx-2 bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Ok</span>`;
      break;
  }

  if (game.value.pointsHome || game.value.pointsAway) {
    status = `<span  class="mx-2 bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">
    ${game.value.pointsHome}-${game.value.pointsAway}
    </span>`;
  }

  return status
})

const canSetTime = computed(() => {
  const isOrganizerCM = userStore.user?.user_roles?.find(
      (userRole: any) =>
          userRole.roleId === 1 &&
          (
              userRole.clubId === (game.value?.organizerClubId ? game.value?.organizerClubId : game.value?.homeTeam?.clubId)
          )
  )
  return userStore.isAdmin || isOrganizerCM || isCMHome.value
})

const isGuestCMOrCoach = computed(() => {
  const isGuestCoach = !!userStore.user?.user_roles?.find(
      (userRole: any) =>
          (
              ((userRole.roleId === 5 || userRole.roleId === 6) &&
                  userRole.clubId === game.value?.guestTeam?.clubId)
              ||
              (userRole.roleId === 7 && userRole.teamId === game.value?.guestTeam?.id))
  )

  return isGuestCoach || isCMGuest.value
})

const isHomeCMOrCoach = computed(() => {
  const isHomeCouch = !!userStore.user?.user_roles?.find(
      (userRole: any) =>
          (
              ((userRole.roleId === 5 || userRole.roleId === 6) &&
                  userRole.clubId === game.value?.homeTeam?.clubId)
              ||
              (userRole.roleId === 7 && userRole.teamId === game.value?.homeTeam?.id))
  )
  return isHomeCouch || isCMHome.value
})

const isCMHome = computed(() => {
  return !!userStore.user?.user_roles?.find(
      (userRole: any) =>
          (userRole.roleId === 1 && userRole.clubId === game.value?.homeTeam?.clubId)
  )
})

const isCMGuest = computed(() => {
  return !!userStore.user?.user_roles?.find(
      (userRole: any) =>
          (userRole.roleId === 1 && userRole.clubId === game.value?.guestTeam?.clubId)
  )
})

const canAcceptSuggestion = computed(() => {
  return isGuestCMOrCoach.value || userStore.isAdmin
})

const canRejectSuggestion = computed(() => {
  return isHomeCMOrCoach.value || !!canAcceptSuggestion.value
})

onMounted(() => {
  fetchGame()
})
</script>

