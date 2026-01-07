import {defineStore} from "pinia";
import type TournamentPrograms from "~/interfaces/tournament/tournamentPrograms";

export const useTournamentProgramStore = defineStore("tournamentProgram", () => {
    const programs = ref([] as Array<TournamentPrograms>);

    async function fetchTournamentPrograms() {
        const res = await useApiV5Fetch("/tournament-programs")

        if (res.data?.value) {
            programs.value = res.data.value as Array<TournamentPrograms>
        }
    }

    return { programs, fetchTournamentPrograms }
})