<template>
  <TimesPage
      :time-slots="timeSlots"
      :loading="loading"
      :count="count"
      @fetch-time-slots="fetchTimeSlotsData"
  />
</template>
<script setup lang="ts">
import type TimeSlot from "~/interfaces/timeSlots/timeSlot";
import {useTimeSlotsFetch} from "~/composables/useTimeSlotsFetch/useTimeSlotsFetch";
import TimesPage from "~/components/times/TimesPage.vue";

const count = ref(0 as Number)
const loading = ref(false)
const timeSlots = ref([] as Array<TimeSlot>)
const timeSlotIdForDelete = ref(0)

const {fetchTimeSlots} = useTimeSlotsFetch()

async function fetchTimeSlotsData(data: any) {
  if (loading.value) return;
  timeSlotIdForDelete.value = 0
  loading.value = true
  const res = await fetchTimeSlots(
      data
  ) as {
    count: Number,
    rows: Array<TimeSlot>
  }

  if (!res) {
    return
  }
  count.value = res.count
  timeSlots.value = [...res.rows]
  loading.value = false
}
</script>
