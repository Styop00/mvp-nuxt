<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
        :headers="headers"
        :clickable="true"
        :data="users"
        title="Users"
        :loading="loading"
        :show-edit="isAdmin"
        :show-delete="isAdmin"
        class="bg-white"
        @sorted="sort"
        @editIconClicked="editUser"
        @deleteIconClicked="showDeleteConfirmation"
        @rowClick="onRowClick"
      >
        <template #header>
          <BaseButton
            class="text-sm sm:text-base sm:!px-8 block !py-2"
            @click="createUser"
          >
            Create User
          </BaseButton>
        </template>
        <template #headerBottom>
          <div class="w-full flex justify-between">
            <form class="flex xl:w-[350px] w-full items-center gap-4 p-2">
              <label for="roles" class="text-sm text-nowrap">
                Filter by
              </label>
              <FilterSelect
                :options="rolesGroup"
                v-model:value="selectedRoleDescription"
                class="bg-white "
              />
            </form>

            <SearchInput
              v-model="searchQuery"
              placeholder="Search..."
              class="xl:w-[350px] w-full"
            />
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between ml-4 items-center gap-6">
            <div>
              <p
                class="text-xs text-nowrap tracking-wider text-gray-400 font-bold"
              >
                {{ currentShowCount }}
              </p>
            </div>
            <div
              class="flex justify-start mx-2 lg:justify-end items-center gap-6"
            >
              <p class="flex items-center text-nowrap gap-4 my-3 text-sm">
                Rows per page:
                <Select
                  :options="limitOptions"
                  v-model:value="limit"
                  direction="top"
                />
              </p>
              <template v-if="count > limit.value">
                <TablePagination
                  v-model:page="page"
                  :page-count="pagesCount"
                  @page-changed="fetchUsers"
                />
              </template>
            </div>
          </div>
        </template>
      </TableStriped>
    </div>
    <ConfirmationModal
      v-model:visible="showConfirmModal"
      message="Are you sure you want to delete this user?"
      @confirm="deleteUserCustom"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUsersFetch } from '~/composables/useUsersFetch/useUsersFetch';
import BaseButton from '~/components/buttons/BaseButton.vue';
import ConfirmationModal from '~/components/modals/user/ConfirmationDeleteModal.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import { useUserStore } from '~/store/user';
import TablePagination from '~/components/pagination/TablePagination.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import SearchInput from '~/components/inputs/SearchInput.vue';
import { useRoleStore } from '~/store/role';
import TableStriped from "~/components/tables/TableStriped.vue";
import Select from '~/components/inputs/Select.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import FilterSelect from "~/components/inputs/FilterSelect.vue";

const rolesStore = useRoleStore()
const roles = computed(() => {
  return rolesStore.roles
})
const rolesGroup = ref([] as SelectOptions[]);

const { users, fetchUsers, sort, deleteUser, page, limit, count, searchQuery, selectedRoleId, loading } = useUsersFetch();

const headers = ref([] as Array<TableHeader>);
const showConfirmModal = ref(false);
const userToDeleteId = ref<number | null>(null);
const router = useRouter();
const selectedRoleDescription = ref({
  label: "",
  value: null,
  disabled: false
} as unknown as SelectOptions)

const userStore = useUserStore();
const isAdmin = computed(() => userStore.getUserRoleNames().includes('Super Admin'));

const limitOptions = ref([
    { label: "10", value: 10, disabled: false },
    { label: "20", value: 20, disabled: false },
    { label: "50", value: 50, disabled: false },
] as SelectOptions[]);

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number))
})

const currentShowCount = computed(() => {
  if (!count.value || count.value === 0) {
    return '0 of 0';
  }

  const currentPage = +page.value;
  const perPage = +limit.value.value;

  const currentPageMaxValue = currentPage * perPage;
  const currentPageMinValue = (currentPage - 1) * perPage + 1;

  const maxValue = currentPageMaxValue > +count.value ? +count.value : currentPageMaxValue;

  return `${currentPageMinValue} - ${maxValue} of ${count.value}`;
});


watchEffect(() => {
  rolesGroup.value = roles.value.map(role => ({
    label: role.description,
    value: role.id,
    disabled: false
  })).sort((a, b) => a.label.localeCompare(b.label));
  rolesGroup.value.unshift({
    label: "--- All Roles ---",
    value: '',
    disabled: false
  })
  selectedRoleDescription.value = rolesGroup.value[0]
});

watch(() => roles.value, () => {
  if(!roles.value.length) {
    rolesStore.fetchRoles()
  }
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  fetchUsers();
  headers.value = [
    { label: 'Id', sortable: true, sortValue: 'id', dataKey: 'id', className: 'w-24' },
    { label: 'Name', sortable: true, sortValue: 'name', dataKey: 'name' },
    { label: 'Email', sortable: true, sortValue: 'email', dataKey: 'email' },
    { label: 'Roles', sortable: false, sortValue: 'roles', dataKey: 'roles' },
  ];
});

watch(page, () => {
  fetchUsers();
});

watch([limit, searchQuery, selectedRoleId], () => {
  if (page.value === 1) {
    fetchUsers();
  } else {
    page.value = 1;
  }
});

watch(selectedRoleDescription, (newDescription) => {
    if(newDescription) {
      selectedRoleId.value = newDescription.value as number;
      page.value = 1
      fetchUsers()
    }
});

function editUser(id: number) {
  router.push(`/super-admin/users/${id}`);
}

function createUser() {
  router.push(`/super-admin/users/create`);
}

function showDeleteConfirmation(id: number) {
  userToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteUserCustom() {
  if (userToDeleteId.value !== null) {
    await deleteUser(userToDeleteId.value);
    fetchUsers();
    userToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}

function onRowClick(row: any) {
  editUser(row.id);
}
</script>
