import {defineStore} from "pinia";
import type Region from "~/interfaces/regions/region";

export const useRegionStore = defineStore("regions", () => {
    const regions = ref([] as Array<Region>);

    async function fetchRegions() {
        const res = await useApiV5Fetch("/regions")

        if (res.data?.value) {
            regions.value = res.data.value as Array<Region>
        }
    }

    return { regions, fetchRegions }
})