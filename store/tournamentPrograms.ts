import {defineStore} from "pinia";
import type TournamentPrograms from "~/interfaces/tournament/tournamentPrograms";

export const useTournamentProgramStore = defineStore("tournamentProgram", () => {
    const programs = ref([] as Array<TournamentPrograms>);
    const canResendRequest = ref(true);

    async function fetchTournamentPrograms() {
        const res = await useApiV5Fetch("/tournament-programs")

        if (!canResendRequest) return;
        const response = res.data?.value as Array<TournamentPrograms>;

        if (response && response?.length) {
            programs.value = res.data.value as Array<TournamentPrograms>
        } else {
            canResendRequest.value = false
        }
    }

    return { programs, fetchTournamentPrograms }
})