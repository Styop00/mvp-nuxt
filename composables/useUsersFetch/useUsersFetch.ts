import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type User from "~/interfaces/users/users";
import type UsersTableData from "~/interfaces/users/usersTableData";
import {useUserStore} from "~/store/user";

export function useUsersFetch() {
  const userStore = useUserStore();
  const users = ref([] as Array<UsersTableData>);
  const originalData = ref([] as Array<User>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");
  const page = ref(1);
  const limit = ref({
    label: "10",
    value: 10,
    disabled: false,
  } as SelectOptions);

  const searchQuery = ref("");
  const selectedRoleId = ref<number | null>(null);
  const count = ref(0 as Number);
  const loading = ref(false);
  async function fetchUserById(id: number) {
    const response = await useApiV5Fetch(`users/${id}`);
    if (!response.data?.value) {
      return;
    }
    return response.data.value as User;
  }

  async function fetchTeamUserById(id: number) {
    const response = await useApiV5Fetch(`users/teams/${id}`, {
      query: {
        seasonSportId: userStore.seasonSportId,
      }
    });
    if (!response.data?.value) {
      return;
    }
    return response.data.value as User;
  }

  async function fetchUsers() {
    if (loading.value) {
      return;
    }

    loading.value = true;
    // users.value = [];
    try {
      const response = await useApiV5Fetch("users", {
        query: {
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          page: page.value,
          limit: limit.value.value,
          searchTerm: searchQuery.value,
          role: selectedRoleId.value,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const result = response.data.value as { rows: User[]; count: number };

      users.value = result.rows.map((data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        isVerified: data.isVerified,
        roles: (data.roles ?? [])
          .map((role: any) => {
            return typeof role === "object" && role.description
              ? role.description
              : role;
          })
          .join(", "),
      }));

      originalData.value = result.rows;
      count.value = result.count;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(user: Partial<User>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("users", {
        method: "POST",
        body: user,
      });
      if (response.data?.value) {
        fetchUsers();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function createUserByAdmin(user: Partial<User>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("users/create-byadmin", {
        method: "POST",
        body: user,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(id: number, user: Partial<User>, withoutEmail:boolean = true) {
    loading.value = true;
    try {
      let response;
      if (withoutEmail) {
        const { email, ...userWithoutEmail } = user;
        response = await useApiV5Fetch(`users/${id}`, {
          method: "PUT",
          body: userWithoutEmail,
        });
      } else {
        response = await useApiV5Fetch(`users/${id}`, {
          method: "PUT",
          body: user,
        });
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: number) {
    loading.value = true;
    users.value = []
    try {
      const response = await useApiV5Fetch(`users/${id}`, {
        method: "DELETE",
      });
      if (response.data?.value) {
        fetchUsers();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  function sort(column: string) {
    if (orderBy.value === column) {
      orderDirection.value = orderDirection.value === "asc" ? "desc" : "asc";
    } else {
      orderBy.value = column;
      orderDirection.value = "asc";
    }
    fetchUsers();
  }

  async function deleteUserRole(id: number, data: any) {
    const response = await useApiV5Fetch(`users/${id}/roles`, {
      method: "DELETE",
      query: {
        ...data,
        seasonSportId: userStore.seasonSportId,
      }
    });

    return response.data?.value;
  }

  return {
    users,
    originalData,
    orderBy,
    orderDirection,
    fetchUsers,
    createUser,
    createUserByAdmin,
    updateUser,
    deleteUser,
    sort,
    page,
    limit,
    count,
    searchQuery,
    selectedRoleId,
    fetchUserById,
    loading,
    deleteUserRole,
    fetchTeamUserById,
  };
}
