export const useConflictFetch = () => {
    async function deleteConflictById(id: number) {
        const res = await useApiV5Fetch(`conflicts/${id}`, {
            method: 'DELETE',
        })

        if (res.data?.value) {
            return res.data.value
        }
        return null
    }

    async function updateConflictById(id: number, data: any) {
        const res = await useApiV5Fetch(`conflicts/${id}`, {
            method: 'PUT',
            body: data
        })

        if (res.data?.value) {
            return res.data.value
        }
        return null
    }

    return {deleteConflictById, updateConflictById}
}