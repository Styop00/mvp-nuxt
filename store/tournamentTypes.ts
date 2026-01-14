import {defineStore} from "pinia";
import type TournamentTypes from "~/interfaces/tournament/tournamentType";

export const useTournamentTypeStore = defineStore("tournamentTypes", () => {
    const types = ref([] as Array<TournamentTypes>);
    const canResendRequest = ref(true);

    async function fetchTournamentTypes() {
        if (!canResendRequest) return;
        const res = await useApiV5Fetch("/tournament-types")
        const response = res.data?.value as Array<TournamentTypes>

        if (response && response?.length) {
            types.value = res.data.value as Array<TournamentTypes>
        } else {
            canResendRequest.value = false
        }
    }

    return { types, fetchTournamentTypes }
})