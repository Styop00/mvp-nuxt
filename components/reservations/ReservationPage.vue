<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :loading="loading"
            :headers="headers"
            :clickable="false"
            :data="reservations"
            title="Reservations"
            class="bg-dark-surface-default"
            :show-edit="timeSlot.expiration ? moment().isSameOrBefore(moment(timeSlot.expiration).endOf('day')) : moment().isSameOrBefore(moment(timeSlot.date).endOf('day'))"
            :show-delete="true"
            @sorted="sort"
            @edit-icon-clicked="(rowId) => openReserveModal(rowId)"
            @delete-icon-clicked="(rowId) => openDeleteModal(rowId)"
            :show-actions="true"
            :fixed-table="false"
        >
          <template #header v-if="timeSlot.expiration ? moment().isSameOrBefore(moment(timeSlot.expiration).endOf('day')) : moment().isSameOrBefore(moment(timeSlot.date).endOf('day'))">
            <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="() => showReserveModal = true"
            >
              Reserve
            </BaseButton>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteReservationModal
        v-model:visible="showDeleteModal"
        v-model:reservation-id="reservationForDelete"
        @deleted="fetchData"
    />
    <CreateOrUpdateReservation
        v-model:reservation-id="reservationForUpdate"
        v-model:visible="showReserveModal"
        @re-fetch="fetchData"
        :time-slot="timeSlot"
    />
  </div>
</template>

<script setup lang="ts">

import {useReservationsFetch} from "~/composables/useReservationsFetch/useReservationsFetch";
import type ReservationsTable from "~/interfaces/reservations/reservationsTable";
import BaseButton from "~/components/buttons/BaseButton.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import TableStriped from "~/components/tables/TableStriped.vue";
import DeleteReservationModal from "~/components/modals/reservations/DeleteReservationModal.vue";
import CreateOrUpdateReservation from "~/components/modals/reservations/CreateOrUpdateReservation.vue";
import moment from "moment";
import type TimeSlot from "~/interfaces/timeSlots/timeSlot";
import {useTimeSlotsFetch} from "~/composables/useTimeSlotsFetch/useTimeSlotsFetch";

const route = useRoute()
const timeId = +route.params.timeId
const reservations = ref([] as Array<ReservationsTable>)
const orderBy = ref('startTime')
const orderDirection = ref('asc')
const loading = ref(false)
const showDeleteModal = ref(false)
const showReserveModal = ref(false)
const reservationForDelete = ref(0)
const reservationForUpdate = ref(0)
const timeSlot = ref({} as TimeSlot)

const headers = [
  {
    label: 'Start',
    sortable: true,
    sortValue: 'startTime',
    dataKey: 'startTime',
  },
  {
    label: 'End',
    sortable: true,
    sortValue: 'endTime',
    dataKey: 'endTime',
  },
  {
    label: 'Type',
    sortable: true,
    sortValue: 'type',
    dataKey: 'type',
  },
  {
    label: 'Age Group',
    sortable: false,
    sortValue: '',
    dataKey: 'age',
  },
  {
    label: 'Description',
    sortable: true,
    sortValue: 'text',
    dataKey: 'text',
  },
]

const {fetchReservations} = useReservationsFetch()
const {fetchTimeSlotById} = useTimeSlotsFetch()

async function fetchData() {
  loading.value = true
  reservations.value = []
  const res = await fetchReservations({
    time_slot_id: timeId,
    order_by: orderBy.value,
    order_direction: orderDirection.value
  })
  reservations.value = res.map(reservation => {
    return {
      id: reservation.id,
      startTime: moment(reservation.start_time, 'HH:mm').format('HH:mm'),
      endTime: moment(reservation.end_time, 'HH:mm').format('HH:mm'),
      type: reservation.type.text,
      age: reservation.age_group ? reservation.age_group : 'All',
      text: reservation.text,
    }
  })
  loading.value = false
}

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchData()
}

async function fetchTimeSlot() {
  timeSlot.value = await fetchTimeSlotById(timeId)
}

function openDeleteModal(rowId: number) {
  reservationForDelete.value = rowId
  showDeleteModal.value = true
}

function openReserveModal(rowId: number) {
  reservationForUpdate.value = rowId
  showReserveModal.value = true
}

onMounted(() => {
  fetchTimeSlot()
  fetchData()
})
</script>