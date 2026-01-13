<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_coach_courses" :title="(!isNaN(props.courseId as number) && props.visible) ? 'Edit Course' : 'Create New Course'">
    <div class="pb-4">
      <CoachForm
          :isShowFileInput="false"
          :course="course"
          :coachId="(props.coachId as number)"
          @refreshData="onCustomEventFromChild"
      />
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import CoachForm from '~/components/forms/CoachForm.vue';
import { useCoachEducationFetch } from '~/composables/useCoachEducationFetch/useCoachEducationFetch';
import type CoachEducation from '~/interfaces/coachEducation/coachEducation';
import type SelectOptions from '~/interfaces/inputs/selectOptions';

const props = defineProps({
  visible: Boolean,
  courseId: Number,
  coachId: Number
});

const emit = defineEmits(['update:visible', 'refreshData']);

const modal = ref(props.visible);
const moduleName = ref({} as SelectOptions)
const course = ref({} as CoachEducation);

const { fetchCourseById, loading } = useCoachEducationFetch()

function onCustomEventFromChild() {
  emit('refreshData'); 
}

async function fetchCourse(id: number) {
  try {
    const response = await fetchCourseById(id);
    if (response) {
        moduleName.value = { label: response.module || '', value: response.module || '', disabled: false };
        course.value = {
            educationId: response.id,
            id: response.id,
            date: response.date || '',
            hours: response.hours,
            module: response.module || '',
            comment: response.comment || '',
            licenseM: response.coachEducationLicenseTypes.some(lt => lt.coachLicenseTypeId === 1),
            licenseB: response.coachEducationLicenseTypes.some(lt => lt.coachLicenseTypeId === 2),
            licenseT: response.coachEducationLicenseTypes.some(lt => lt.coachLicenseTypeId === 3),
            coachId: response.coachId
        };
    }
  } catch (err) {
    console.log(err);
  }
}
function resetForm() {
  course.value = {} as CoachEducation
  moduleName.value = { label: '', value: '', disabled: false };
}

function closeModal() {
  resetForm();
  modal.value = false;
}


watch(() => props.visible, async () => {
  if(!isNaN(props.courseId as number) && props.visible) {
    await fetchCourse(props.courseId as number)
  }
  modal.value = props.visible;
});


watch(() => modal.value, (newVal) => {
  if (!newVal) {
    closeModal();
    emit('update:visible', false);
  }
});
</script>
