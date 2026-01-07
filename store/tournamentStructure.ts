import {defineStore} from "pinia";
import type TournamentStructures from "~/interfaces/tournament/tournamentStructures";

export const useTournamentStructureStore = defineStore("tournamentStructure", () => {
    const structures = ref([] as Array<TournamentStructures>);

    async function fetchTournamentStructures() {
        const res = await useApiV5Fetch("/tournament-structures")

        if (res.data?.value) {
            structures.value = res.data.value as Array<TournamentStructures>
        }
    }

    return { structures, fetchTournamentStructures }
})