import {defineStore} from "pinia";
import type TournamentTypes from "~/interfaces/tournament/tournamentType";

export const useTournamentTypeStore = defineStore("tournamentTypes", () => {
    const types = ref([] as Array<TournamentTypes>);

    async function fetchTournamentTypes() {
        const res = await useApiV5Fetch("/tournament-types")

        if (res.data?.value) {
            types.value = res.data.value as Array<TournamentTypes>
        }
    }

    return { types, fetchTournamentTypes }
})