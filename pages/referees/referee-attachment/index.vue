<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <Breadcrumb/>
        <div
            class="bg-white min-h-96 flex flex-col gap-10 p-4 items-center w-full rounded-lg"
        >
          <div class="flex w-full items-start px-2">
            <p
                class="text-base font-bold py-4 flex items-center justify-start tracking-widest"
            >
              <span
                  class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
              />
              Referee Attachment
            </p>
          </div>
          <div class="flex gap-6 w-full items-center  ml-2">
            <Select
                :options="weekOptions"
                v-model:value="selectedWeek"
                class="min-w-52"
                @update:value="handleInputChange"
            />
            <Select
                :options="regionOptions"
                v-model:value="selectedRegion"
                class="min-w-52"
                @update:value="handleInputChange"
            />
            <Select
                :options="levelOptions"
                v-model:value="selectedLevel"
                class="min-w-52"
                @update:value="handleInputChange"
            />

            <Select
                :options="statusOptions"
                v-model:value="selectedStatus"
                class="min-w-52"
                @update:value="handleInputChange"
            />
            <Select
                :options="dayOptions"
                v-model:value="selectedDay"
                class="min-w-52"
                @update:value="handleInputChange"
            />

            <CheckBox
                v-model:value="clubMatches"
                label="Also club matches"
                name="Also club matches"
                class="text-xs whitespace-nowrap"
                @change="handleInputChange"
            />
          </div>
          <div class="flex gap-6 items-center justify-between">
            <BaseButton @click="openAutoApplyModal">Auto-Apply</BaseButton>
            <BaseButton @click="redirectGetRefList">Judge vacancy</BaseButton>
            <BaseButton class="bg-green-500 text-white" @click="approveDraft"
            >Approve Draft
            </BaseButton
            >
            <BaseButton class="bg-red-500 text-white" @click="deleteDraft"
            >Delete Draft
            </BaseButton
            >
          </div>
          <template v-if="games.length > 0">
            <div class="border border-gray-200 w-full">
              <div
                  v-for="(row, index) in [...games]"
                  :key="index"
                  class="table-row grid grid-cols-[2fr_0.3fr_1.5fr_1.5fr_1.5fr_0.5fr] h-[120px] border-b border-gray-200"
              >
                <div class="table-cell text-xs p-2 border-r border-gray-200">
                  <span class="text-sm">
                    {{ getDayOfWeek(row.date ? row.date : '') }} {{ row.date }}
                    {{ row.time }}
                  </span>
                  <br/>
                  {{ row.homeTeam.localName }} - {{ row.guestTeam.localName }}
                  <br/>
                  {{ row.statusId == 10 ? `Result ${row.pointsHome} ${row.pointsAway}` : null }}
                  <br v-if="row.statusId == 10"/>
                  {{ row.number }} - {{ row.tournament.shortName }}
                  <br/>
                  {{ row.court.venue.name }} <br/>
                  Level:
                  {{
                    row.starRating || 0
                  }}/{{ row.tournament.tournamentGroup.tournamentConfig.refPrio || 0 }}
                </div>
                <div class="table-cell text-xs p-2 border-r border-gray-200">
                  <font-awesome
                      :icon="['fas', 'arrow-down-wide-short']"
                      class="cursor-pointer w-full"
                  />
                </div>
                <div
                    v-for="(gamePlan, pos) in getProcessedGamePlans(row.id)"
                    :key="`gamePlan_${gamePlan.id}_${pos}`"
                    class="table-cell flex items-center text-xs justify-center p-2 border-r border-gray-200"
                    :class="['table-cell', 'card', 'flex', 'flex-col', 'items-center', 'justify-center', getBgColor(gamePlan.gameRoleId, row.tournament.tournamentGroup.tournamentConfig.refsPerGame, gamePlan.statusId, gamePlan.userId), getColor(gamePlan.gameRoleId, row.tournament.tournamentGroup.tournamentConfig.refsPerGame, gamePlan.statusId, gamePlan.userId)]"
                    @click="refBoxClick(row.id, gamePlan.user?.referee?.id || 0, gamePlan.gameRoleId)"
                >
                  <span>{{ gamePlan.user?.name || 'Referee' }}</span>
                  <p v-if="gamePlan.user">
                    ID: #{{ gamePlan.user.referee.license }}<br/>
                    Fee: kr. {{ (gamePlan?.fee / 100).toFixed(2) }}<br/>
                    Level:
                    {{
                      gamePlan.user.referee.prio


                    }}/{{ gamePlan.user.referee.maxStarRating || 0 }}
                    <span v-if="gamePlan.user.referee.mentor"> (M)</span>
                    <span v-if="gamePlan.user.referee.prospect"> (P)</span>
                  </p>
                </div>
                <div class="table-cell text-xs p-2"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <AutoApplyModal
          v-model:visible="autoApplyModal"
          :isOverflowVisible="true"
          @confirm="performAutoSet"
      />
      <ApproveDraftModal
          message="Approve all draft labels visible on the screen?"
          v-model:visible="approveDraftModal"
          :isOverflowVisible="true"
          @confirm="performApproveDraft"
      />
      <DeleteDraftModal
          message="Delete drafts visible on the screen?"
          v-model:visible="deleteDraftModal"
          :isOverflowVisible="true"
          @confirm="performDeleteDraft"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import Select from '~/components/inputs/Select.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import {regionOptions} from "~/constants/regions"
import {refereeLevels, refereeLevelsBasketball, levelOptionsOther} from '~/constants/refereeLevelsPrio';
import {useUserStore} from '~/store/user';
import CheckBox from '~/components/inputs/CheckBox.vue';
import {useGamesFetch} from '~/composables/useGamesFetch/useGamesFetch';
import type Game from '~/interfaces/games/game';
import BaseButton from '~/components/buttons/BaseButton.vue';
import AutoApplyModal from "~/components/modals/referee/AutoApplyModal.vue"
import {useRefereesFetch} from "~/composables/useRefereeFetch/useRefereeFetch"
import DeleteDraftModal from '~/components/modals/referee/DeleteDraftModal.vue';
import ApproveDraftModal from '~/components/modals/referee/ApproveDraftModal.vue';

const {seasonSportId} = useUserStore();
const selectedWeek = ref({} as SelectOptions);
const selectedRegion = ref({} as SelectOptions);
const selectedLevel = ref({} as SelectOptions);
const selectedStatus = ref({} as SelectOptions);
const selectedDay = ref({} as SelectOptions);
const newItem1 = {label: "No", value: "0", disabled: false};
const newItem2 = {label: "--All Levels--", value: "0", disabled: false};
const newItem3 = {label: "8: Club matches + Unattached ranks", value: "8", disabled: false};
const clubMatches: Ref<boolean> = ref(false)
const games = ref([] as Game[])
const autoApplyModal = ref(false)
const deleteDraftModal = ref(false)
const approveDraftModal = ref(false)
const selectRefForGamesArr = ref<{
  gameId: number;
  pos: number;
  gameRoleId?: number;
  seasonSportId: number;
  userId?: number | null;
  generateRunId?: number;
  onlyForRefs?: any[];
  prioBoost?: number;
  license?: number | null;
}[]>([])

const {getGamesWithReferees} = useGamesFetch()
const {selectRefForGame, bulkRefApproveDraft, bulkPerformSetRef} = useRefereesFetch()

const weekOptions = computed(() => {
  const options = [] as SelectOptions[];
  // Weeks 31 to 52
  for (let i = 31; i <= 52; i++) {
    options.push({value: i, label: `Week ${i}`, disabled: false});
  }
  // Weeks 1 to 25
  for (let i = 1; i <= 25; i++) {
    options.push({value: i, label: `Week ${i}`, disabled: false});
  }
  return options;
});

const levelOptions = computed(() => {
  return [
    ...(seasonSportId === 20 ? refereeLevelsBasketball : [newItem1, newItem2, ...refereeLevels, newItem3, ...levelOptionsOther]),
  ]
})

function getProcessedGamePlans(rowId: number) {
  const row = games.value.find((game) => game.id === rowId);

  const refsPerGame = row?.tournament?.tournamentGroup?.tournamentConfig?.refsPerGame || 3;

  const positions = Array.from({length: Number(refsPerGame)}, (_, index) => index + 1);

  if (!row) {
    return positions.map((pos) => ({
      id: `placeholder_${pos}`,
      gameRoleId: pos,
      user: null,
      fee: 0,
      statusId: 0,
    }));
  }

  const gamePlans = [...row.gamePlans];

  return positions.map((pos) => {
    const gamePlan = gamePlans.find((plan) => plan.gameRoleId === pos);
    return (
        gamePlan || {
          id: `placeholder_${pos}`,
          gameRoleId: pos,
          user: null,
          fee: 0,
          statusId: 0,
        }
    );
  });
}

const statusOptions: SelectOptions[] = [
  {value: "0", label: "--All Statuses--", disabled: false},
  {value: "-1", label: "Missing Referee", disabled: false},
  {value: "1", label: "Saved in Basys", disabled: false},
  {value: "2", label: "Approved", disabled: false},
  {value: "3", label: "Pending Referee Acceptance", disabled: false},
  {value: "4", label: "Draft", disabled: false},
  {value: "5", label: "Rejected by Referee", disabled: false},
];

const dayOptions: SelectOptions[] = [
  {value: "0", label: "--All Days--", disabled: false},
  {value: "-1", label: "Mon-Fri", disabled: false},
  {value: "-2", label: "Sat-Sun", disabled: false},
  {value: "2", label: "Monday", disabled: false},
  {value: "3", label: "Tuesday", disabled: false},
  {value: "4", label: "Wednesday", disabled: false},
  {value: "5", label: "Thursday", disabled: false},
  {value: "6", label: "Friday", disabled: false},
  {value: "7", label: "Saturday", disabled: false},
  {value: "1", label: "Sunday", disabled: false},
];

const currentWeek = getCurrentWeekNumber();
selectedWeek.value = weekOptions.value.find(option => option.value === currentWeek) || selectedWeek.value;
selectedRegion.value = regionOptions[0];
selectedLevel.value = levelOptions.value[0];
selectedStatus.value = statusOptions[0];
selectedDay.value = dayOptions[0];

function getCurrentWeekNumber() {
  const date = new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[date.getDay()];
}

function getBgColor(roleId: number, refsPerGame: number, statusId: number, userId: number) {
  if (userId == 0) {
    if (roleId <= refsPerGame) {
      return "bg-red-100"
    } else {
      return "bg-white";
    }
  } else if (String(userId) == "-2") {
    return "bg-yellow-300"
  } else if (String(userId) == "-3") {
    return "bg-yellow-100"
  } else {
    if (statusId === 0) return "bg-green-300";
    if (statusId === 1) return "bg-green-100";
    if (statusId === 2) return "bg-blue-300";
    if (statusId === 3) return "bg-blue-100";
    if (statusId === 4) return "bg-red-300";
    if (statusId === 5) return "bg-gray-100";
    if (statusId < 0) return "bg-red-300";
  }
}

function getColor(roleId: number, refsPerGame: number, statusId: number, userId: number) {
  if (userId == 0) {
    if (roleId <= refsPerGame) {
      return "text-black"
    } else {
      return "text-black"
    }
  } else if (String(userId) == "-2") {
    return "text-black"
  } else if (String(userId) == "-3") {
    return "text-black"
  } else {
    if (statusId === 0) return "text-white";
    if (statusId === 1) return "text-black";
    if (statusId === 2) return "text-white";
    if (statusId === 3) return "text-black";
    if (statusId === 4) return "text-white";
    if (statusId === 5) return "text-black";
    if (statusId < 0) return "text-white";
  }
}


async function handleInputChange() {
  const response = await getGamesWithReferees(
      seasonSportId,
      selectedWeek.value.value as number,
      selectedLevel.value.value as string,
      selectedStatus.value.value as string,
      selectedRegion.value.value as string,
      selectedDay.value.value as string)

  const result = response as { rows: Game[]; count: number };
  games.value = result.rows.map(game => {
    game.gamePlans = game.gamePlans.sort((a, b) => a.gameRoleId - b.gameRoleId);
    return game;
  });
}

async function performDeleteDraft() {
  selectRefForGamesArr.value = [];
  games.value.forEach((game) => {
    game.gamePlans.forEach((gamePlan) => {
      if (gamePlan.statusId === 3) {
        selectRefForGamesArr.value.push({
          gameId: game.id,
          pos: gamePlan.gameRoleId,
          seasonSportId,
          userId: null,
          license: null,
        })
      }
    })
  })
  await bulkPerformSetRef(selectRefForGamesArr.value);
  getGamesWithRefereesForPage();
}

async function performAutoSet() {
  const result = findRequiredGameRoleIds();
  await selectRefForGame([...result]);
  getGamesWithRefereesForPage();
}

function findRequiredGameRoleIds() {
  selectRefForGamesArr.value = [];
  games.value.forEach((game) => {
    const gameRoleIds = game.gamePlans.map((gamePlan) => gamePlan.gameRoleId);
    [1, 2, 3].forEach((pos) => {
      const gamePlanItem = game.gamePlans.find((item) => item.gameRoleId === pos);
      if (gameRoleIds.includes(pos) && gamePlanItem && gamePlanItem?.userId <= 0) {
        selectRefForGamesArr.value.push({
          gameId: game.id,
          pos,
          seasonSportId
        });
      } else if (!gameRoleIds.includes(pos)) {
        selectRefForGamesArr.value.push({
          gameId: game.id,
          pos,
          seasonSportId
        });
      }
    });
  })
  return selectRefForGamesArr.value;
}


function approveDraft() {
  approveDraftModal.value = true
}

async function performApproveDraft() {
  selectRefForGamesArr.value = [];
  games.value.forEach((game) => {
    game.gamePlans.forEach((item) => {
      if (item.statusId == 3 && item.userId > 0) {
        selectRefForGamesArr.value.push({
          gameId: game.id,
          pos: item.gameRoleId,
          seasonSportId
        })
      }
    })
  })
  await bulkRefApproveDraft([...selectRefForGamesArr.value]);
  getGamesWithRefereesForPage()
}

function deleteDraft() {
  deleteDraftModal.value = true;
}

async function refBoxClick(gameId: number, refId: number, pos: number) {
  navigateTo(`/referees/referee-attachment/${gameId}?refId=${refId}&pos=${pos}`)
}

function openAutoApplyModal() {
  autoApplyModal.value = true
}

function redirectGetRefList() {
  navigateTo(`/referees/referee-attachment/ref-list?week=${selectedWeek.value.value}`)
}

async function getGamesWithRefereesForPage() {
  const response = await getGamesWithReferees(
      seasonSportId,
      selectedWeek.value.value as number,
      selectedLevel.value.value as string,
      selectedStatus.value.value as string,
      selectedRegion.value.value as string,
      selectedDay.value.value as string)
  const result = response as { rows: Game[]; count: number };
  games.value = result.rows.map(game => {
    game.gamePlans = game.gamePlans.sort((a, b) => a.gameRoleId - b.gameRoleId);
    return game;
  });
}

watch(
    [
      selectedWeek.value,
      selectedRegion.value,
      selectedLevel.value,
      selectedStatus.value,
      selectedDay.value,
      clubMatches
    ],
    async () => {
      getGamesWithRefereesForPage()
    },
    {immediate: true}
);
</script>
