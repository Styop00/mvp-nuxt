export const useNotesFetch = () => {
    async function deleteNoteById(id: number) {
        const res = await useApiV5Fetch(`game-notes/${id}`, {
            method: 'DELETE',
        })

        if (res.data?.value) {
            return res.data.value
        }
        return null
    }

    async function createOrUpdateNote(data: any) {
        const res = await useApiV5Fetch(`game-notes`, {
            method: 'POST',
            body: data
        })

        if (res.data?.value) {
            return res.data.value
        }
        return null
    }

    return {deleteNoteById, createOrUpdateNote}
}