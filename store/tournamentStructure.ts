import {defineStore} from "pinia";
import type TournamentStructures from "~/interfaces/tournament/tournamentStructures";

export const useTournamentStructureStore = defineStore("tournamentStructure", () => {
    const structures = ref([] as Array<TournamentStructures>);

    const canResendRequest = ref(true);

    async function fetchTournamentStructures() {
        const res = await useApiV5Fetch("/tournament-structures")
        const response = res.data?.value as Array<TournamentStructures>

        if (response && response?.length) {
            structures.value = res.data.value as Array<TournamentStructures>
        } else {
            canResendRequest.value = false
        }
    }

    return { structures, fetchTournamentStructures }
})