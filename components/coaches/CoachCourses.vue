<template>
  <TableStriped
    :headers="headers"
    :clickable="true"
    :data="data"
    title="Courses"
    class="bg-dark-surface-default"
    :show-edit="isAdmin"
    :show-delete="isAdmin"
    @editIconClicked="editCoachEducation"
    @deleteIconClicked="showDeleteConfirmation"
  >
    <template #header>
      <div v-if="isAdmin">
        <BaseButton
          class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
          @click="editCoachEducation"
        >
          Create Course
        </BaseButton>
      </div>
    </template>
  </TableStriped>

  <ConfirmationDeleteModalEducation
    v-model:visible="showConfirmModal"
    message="Are you sure you want to delete this course?"
    @confirm="deleteCoachCourse"
  />

  <CoachCourseCreateOrUpdateModalVue
    v-model:visible="showConfirmModalEdit"
    :courseId="courseToEditId"
    :coachId="props.coach.id"
    @confirm="editCoachEducation"
    @refreshData="refreshFunc"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import TableStriped from '../tables/TableStriped.vue';
import type Coach from '~/interfaces/coaches/coach';
import type { CoachCoursesTableData } from '~/interfaces/coaches/coachTableData';
import ConfirmationDeleteModalEducation from '~/components/modals/coach/ConfirmationDeleteModalEducation.vue';
import { useCoachEducationFetch } from '~/composables/useCoachEducationFetch/useCoachEducationFetch';
import { useUserStore } from '~/store/user';
import CoachCourseCreateOrUpdateModalVue from '../modals/coach/CoachCourseCreateOrUpdateModal.vue';
import BaseButton from '../buttons/BaseButton.vue';

const props = defineProps<{
  coach: Coach;
}>();

const data = ref([] as Array<CoachCoursesTableData>);
const { deleteCourse } = useCoachEducationFetch();

const emit = defineEmits(['refreshData']);

function refreshFunc() {
  emit('refreshData');
}

const headers = [
  { label: 'Id', sortable: false, sortValue: '', dataKey: 'id', className: 'w-16' },
  { label: 'Module', sortable: false, sortValue: '', dataKey: 'module' },
  { label: 'Date', sortable: false, sortValue: '', dataKey: 'date' },
  { label: 'Comment', sortable: false, sortValue: '', dataKey: 'comment' },
  { label: 'Hours', sortable: false, sortValue: '', dataKey: 'hours' },
  { label: 'Licenses', sortable: false, sortValue: '', dataKey: 'licenses' },
] as Array<TableHeader>;

function licenseTypeIdToString(id: number): string {
  switch (id) {
    case 1:
      return 'M';
    case 2:
      return 'B';
    case 3:
      return 'T';
    default:
      return 'Unknown';
  }
}

const userStore = useUserStore();
const isAdmin = computed(() =>
  userStore.getUserRoleNames().includes('Super Admin', 'Association Admin')
);

const courseToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);
const showConfirmModalEdit = ref(false);


const courseToEditId = ref<number | undefined>()

function showDeleteConfirmation(id: number) {
  courseToDeleteId.value = id;
  showConfirmModal.value = true;
}
async function deleteCoachCourse() {
  if (courseToDeleteId.value !== null) {
    await deleteCourse(courseToDeleteId.value);
    courseToDeleteId.value = null;
    showConfirmModal.value = false;
    emit('refreshData');
  }
}

function editCoachEducation(id: number) {
  courseToEditId.value = id
  showConfirmModalEdit.value = true
}

const coachId = ref()

onMounted(() => {
  if (props.coach) {
    props.coach.coachEducation.forEach((item) => {
      item.coachEducationLicenseTypes.forEach((licenseType) => {
        data.value.push({
          id: item.id,
          module: item.module,
          date: item.date,
          comment: item.comment,
          hours: item.hours,
          licenses: licenseTypeIdToString(licenseType.coachLicenseTypeId),
        });
      });
    });
    coachId.value = props.coach.id
  }
});
</script>
