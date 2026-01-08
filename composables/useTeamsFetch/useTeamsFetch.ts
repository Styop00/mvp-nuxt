import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Team from "~/interfaces/teams/team";
import {useUserStore} from "~/store/user";
import type Users from "~/interfaces/users/users";

export const useTeamsFetch = () => {
    const userStore = useUserStore()
    async function createTeam(data: any): Promise<Team> {
        const response = await useApiV5Fetch(`teams`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as Team
        }
        return {} as Team
    }

    async function fetchTeams(
        clubId?: number | null | Array<Number>,
        orderBy?: string | null,
        orderDirection?: string | null,
        page?: number | null,
        limit?: number | null,
        searchQuery?: string | null,
        requestData?: object | null
    ) {
        const data = {
            club_id: clubId,
            order_by: orderBy,
            order_direction: orderDirection,
            limit: limit,
            page: page,
            search_term: searchQuery,
        }

        if (!clubId) {
            delete data.club_id;
        }

        if (!orderBy) {
            delete data.order_by;
        }

        if (!orderDirection) {
            delete data.order_direction;
        }

        if (!limit) {
            delete data.limit;
        }

        if (!page) {
            delete data.page;
        }

        if (!searchQuery) {
            delete data.search_term;
        }
        const response = await useApiV5Fetch(`teams`, {
            query: {
                deleted: 0,
                ...data,
                season_sport_id: userStore.seasonSportId,
                ...requestData
            },
        })

        if (response.data?.value) {
            return response.data.value as { count: Number, rows: Array<Team> }
        }
        return { count: 0, rows: [] } as { count: Number, rows: Array<Team> }
    }

    async function fetchTeamNames(
        orderBy?: string,
        orderDirection?: string,
        data?: object
    ) {
        const response = await useApiV5Fetch(`teams/names`, {
            query: {
                deleted: false,
                order_by: orderBy,
                order_direction: orderDirection,
                season_sport_id: userStore.seasonSportId,
                ...(data ?? {})
            },
        })

        if (response.data?.value) {
            return response.data.value as Array<Team>
        }
        return [] as Array<Team>
    }

    async function fetchTeamById (teamId: number){
        const response = await useApiV5Fetch(`teams/${teamId}`)

        if (response.data?.value) {
            return response.data.value as Team
        }
        return {} as Team
    }

    async function attachGroupsToTeam(teamId: number, groups: (String | Number | null)[]) {
        const response = await useApiV5Fetch(`teams/${teamId}/attach-groups`, {
            method: 'POST',
            body: groups
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function attachTournamentToTeam(teamId: number, tournamentId: number, data: any) {
        const response = await useApiV5Fetch(`teams/${teamId}/attach-tournament/${tournamentId}`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function deleteTeamById(teamId: number) {
        const response = await useApiV5Fetch(`teams/${teamId}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function updateTeam(teamId: number, data: any) {
        const response = await useApiV5Fetch(`teams/${teamId}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function removeTeamFromTournament(teamTournamentId: number) {
        const response = await useApiV5Fetch(`teams/tournaments/${teamTournamentId}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function getTeamUsers(id: number, data?: any) {
        const response = await useApiV5Fetch(`teams/${id}/users`, {
            query: {
                ...data,
                season_sport_id: userStore.seasonSportId,
            },
        });

        if (!response.data?.value) {
            return null;
        }

        return response.data.value as { rows: Users[], count: number };
    }

    async function addUserToTeam(id: number, data: any) {
        const response = await useApiV5Fetch(`teams/${id}/add-user`, {
            method: 'POST',
            body: data
        })

        return response?.data?.value
    }

    return {
        createTeam,
        fetchTeams,
        fetchTeamById,
        fetchTeamNames,
        attachGroupsToTeam,
        updateTeam,
        deleteTeamById,
        attachTournamentToTeam,
        removeTeamFromTournament,
        getTeamUsers,
        addUserToTeam,
    }
}