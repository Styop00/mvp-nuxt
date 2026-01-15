import {defineStore} from "pinia";
import type TournamentRegistrationTypes from "~/interfaces/tournament/tournamentRegistrationTypes";

export const useTournamentRegistrationTypeStore = defineStore("tournamentRegistrationType", () => {
    const registrationTypes = ref([] as Array<TournamentRegistrationTypes>);
    const canResendRequest = ref(true);

    async function fetchTournamentRegistrationTypes() {
        const res = await useApiV5Fetch("/tournament-registration-types")
        const response = res.data?.value as Array<TournamentRegistrationTypes>

        if (response && response?.length) {
            registrationTypes.value = res.data.value as Array<TournamentRegistrationTypes>
        } else {
            canResendRequest.value = false
        }
    }

    return { registrationTypes, fetchTournamentRegistrationTypes }
})