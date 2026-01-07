import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import {useUserStore} from "~/store/user";
import type Team from "~/interfaces/teams/team";

export function useTournamentGroupFetch() {
    const userStore = useUserStore();
    const loading = ref(false);

    async function fetchTournamentGroups(
        leagueId?: number,
        orderBy?: string,
        orderDirection?: string,
        page?: number,
        limit?: number,
        searchQuery?: string
    ) {
        const response = await useApiV5Fetch("tournament-group", {
            query: {
                leagueId: leagueId,
                orderBy: orderBy,
                orderDirection: orderDirection,
                page: page,
                limit: limit,
                searchTerm: searchQuery,
            },
        });

        if (response.data?.value) {
            return response.data.value;
        }
        return null;
    }

    async function fetchTournamentGroupsWithoutLeagueId(
        orderBy?: string,
        orderDirection?: string,
        page?: number,
        limit?: number,
        searchQuery?: string
    ) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        loading.value = true;

        const registrationDeadLine = `${year}-${month}-${day}`;

        const response = await useApiV5Fetch("tournament-group", {
            query: {
                tournamentRegistrationTypeId: 2,
                registrationDeadLine: registrationDeadLine,
                seasonSportId: userStore.seasonSportId,
                orderBy: orderBy,
                orderDirection: orderDirection,
                page: page,
                limit: limit,
                searchTerm: searchQuery,
            },
        });

        const result = response.data.value as {
            rows: TournamentGroup[];
            count: number;
        };
        if (response.data?.value) {
            loading.value = false;
            return result;
        }
        loading.value = false;
        return null;
    }

    async function fetchTournamentGroupById(id: number) {
        const response = await useApiV5Fetch(`tournament-group/${id}`);

        if (response.data?.value) {
            return response.data.value;
        }
        return null;
    }

    async function updateTournamentGroup(id: number, data: object) {
        const response = await useApiV5Fetch(`tournament-group/${id}`, {
            method: "PUT",
            body: data,
        });

        if (response.data?.value) {
            return response.data.value;
        }
        return null;
    }

    async function deleteTournamentGroup(id: number) {
        const response = await useApiV5Fetch(`tournament-group/${id}`, {
            method: "DELETE",
        });

        if (response.data?.value) {
            return response.data.value;
        }
        return null;
    }

    async function fetchTournamentGroupsNames(query: any) {
        const response = await useApiV5Fetch("tournament-group/names", {
            query: query,
        });

        if (response.data?.value) {
            return response.data.value as Array<TournamentGroup>;
        }
        return [];
    }

    async function fetchTournamentGroupWithTeams(id: number) {
        const response = await useApiV5Fetch(`tournament-group/${id}/teams`);

        if (response.data?.value) {
            return response.data.value as TournamentGroup;
        }
        return null;
    }

    async function fetchPossibleTeams(id: number) {
        const response = await useApiV5Fetch(
            `tournament-group/${id}/possible-teams`
        );

        if (response.data?.value) {
            return response.data.value as Array<Team>;
        }
        return [] as Array<Team>;
    }

    return {
        fetchTournamentGroups,
        fetchTournamentGroupById,
        updateTournamentGroup,
        deleteTournamentGroup,
        fetchTournamentGroupsNames,
        fetchTournamentGroupWithTeams,
        fetchTournamentGroupsWithoutLeagueId,
        fetchPossibleTeams,
        loading
    };
}
