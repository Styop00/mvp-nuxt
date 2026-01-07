import type Penalty from "~/interfaces/games/penalty";

export function useGamePenaltiesFetch() {
    async function createOrUpdate(data: any) {
        const res = useApiV5Fetch('game-penalties', {
            method: 'POST',
            body: data,
        })

        if (res) {
            return res.data.value as Penalty
        }

        return null;
    }

    return {createOrUpdate}
}