import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Tournament from "~/interfaces/tournament/tournament";
import type Team from "~/interfaces/teams/team";
import {useUserStore} from "~/store/user";

export const useTournamentFetch = () => {
    const userStore = useUserStore();

    async function fetchTournaments(
        leagueId?: number,
        orderBy?: string,
        orderDirection?: string,
        page?: number,
        limit?: number,
        searchQuery?: string,
    ) {
        const response = await useApiV5Fetch('tournaments',
            {
                query: {
                    league_id: leagueId,
                    order_by: orderBy,
                    order_direction: orderDirection,
                    page: page,
                    limit: limit,
                    search_term: searchQuery,
                }
            })

        if (response.data?.value) {
            return response.data.value as { count: Number, rows: Array<Tournament> }
        }
        return null
    }

    async function fetchTournamentsNames(query: any) {
        const response = await useApiV5Fetch("tournaments/names", {
            query: query,
        });

        if (response.data?.value) {
            return response.data.value as Array<Tournament>;
        }
        return [];
    }

    async function fetchTournamentsWithoutLeagueId(
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
        const registrationDeadLine = `${year}-${month}-${day}`;

        const response = await useApiV5Fetch("tournaments", {
            query: {
                tournament_registration_type_id: 2,
                registration_dead_line: registrationDeadLine,
                season_sport_id: userStore.seasonSportId,
                order_by: orderBy,
                order_direction: orderDirection,
                page: page,
                limit: limit,
                search_term: searchQuery,
            },
        });

        const result = response.data.value as {
            rows: Tournament[];
            count: number;
        };
        if (response.data?.value) {
            return result;
        }
        return null;
    }

    async function fetchTournamentWithTeams(id: number) {
        const response = await useApiV5Fetch(`tournaments/${id}/teams`);

        if (response.data?.value) {
            return response.data.value as Tournament;
        }
        return null;
    }

    async function fetchTournamentById(id: number): Promise<Tournament | null> {
        const response = await useApiV5Fetch(`tournaments/${id}`)

        if (response.data?.value) {
            return response.data.value as Tournament
        }
        return null
    }

    async function updateTournament(id: number, data: object) {
        const response = await useApiV5Fetch(`tournaments/${id}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function deleteTournament(id: number) {
        const response = await useApiV5Fetch(`tournaments/${id}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function createTournament(data: any) {
        const response = await useApiV5Fetch(`tournaments`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as Tournament
        }
        return null
    }

    async function fetchPossibleTeams(id: number) {
        const response = await useApiV5Fetch(`tournaments/${id}/possible-teams`)

        if (response.data?.value) {
            return response.data.value as Array<Team>
        }
        return [] as Array<Team>
    }

    return {
        fetchTournaments,
        fetchTournamentById,
        updateTournament,
        createTournament,
        deleteTournament,
        fetchPossibleTeams,
        fetchTournamentsNames,
        fetchTournamentWithTeams,
        fetchTournamentsWithoutLeagueId
    };
}