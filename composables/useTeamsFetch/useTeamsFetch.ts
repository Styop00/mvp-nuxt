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
            clubId: clubId,
            orderBy: orderBy,
            orderDirection: orderDirection,
            limit: limit,
            page: page,
            searchTerm: searchQuery,
        }

        if (!clubId) {
            delete data.clubId;
        }

        if (!orderBy) {
            delete data.orderBy;
        }

        if (!orderDirection) {
            delete data.orderDirection;
        }

        if (!limit) {
            delete data.limit;
        }

        if (!page) {
            delete data.page;
        }

        if (!searchQuery) {
            delete data.searchTerm;
        }
        const response = await useApiV5Fetch(`teams`, {
            query: {
                deleted: false,
                ...data,
                seasonSportId: userStore.seasonSportId,
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
                orderBy: orderBy,
                orderDirection: orderDirection,
                seasonSportId: userStore.seasonSportId,
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
                seasonSportId: userStore.seasonSportId,
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