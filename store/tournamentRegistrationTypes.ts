import {defineStore} from "pinia";
import type TournamentRegistrationTypes from "~/interfaces/tournament/tournamentRegistrationTypes";

export const useTournamentRegistrationTypeStore = defineStore("tournamentRegistrationType", () => {
    const registrationTypes = ref([] as Array<TournamentRegistrationTypes>);

    async function fetchTournamentRegistrationTypes() {
        const res = await useApiV5Fetch("/tournament-registration-types")

        if (res.data?.value) {
            registrationTypes.value = res.data.value as Array<TournamentRegistrationTypes>
        }
    }

    return { registrationTypes, fetchTournamentRegistrationTypes }
})