import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Roles from "~/interfaces/roles/roles";

export function useRolesFetch() {
  const roles = ref([] as Array<Roles>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");

  async function fetchRoles() {
    const response = await useApiV5Fetch("roles", {
      query: {
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
      },
    });

    if (!response.data?.value) {
      return;
    }

    const res = response.data.value as Array<Roles>;
    roles.value = res;
  }

  async function assignUserRole(roleId: number, userId: number, data: any) {
    const response = await useApiV5Fetch(`roles/${roleId}/users/${userId}`, {
      method: "POST",
      body: data,
    });


    if (!response.data?.value) {
      return;
    }

    return response.data.value;
  }

  async function denyUserRole(userId: number, data: any) {
    const response = await useApiV5Fetch(`roles/users/${userId}`, {
      method: "DELETE",
      query: data,
    });


    if (!response.data?.value) {
      return;
    }

    return response.data.value;
  }

  async function approveUserRole(userId: number, data: any) {
    const response = await useApiV5Fetch(`roles/users/${userId}`, {
      method: "POST",
      query: data,
    });

    if (!response.data?.value) {
      return;
    }

    return response.data.value;
  }

  return {
    orderBy,
    orderDirection,
    fetchRoles,
    assignUserRole,
    denyUserRole,
    approveUserRole,
  };
}
