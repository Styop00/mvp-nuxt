import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import { defineStore } from "pinia";
import type Roles from "~/interfaces/roles/roles";

export const useRoleStore = defineStore("role", () => {
  const roles = ref([] as Array<Roles>);
  const rolesNames = ref([] as string[]);

  async function fetchRoles() {
    const res = await useApiV5Fetch("/roles");

    if (res.data?.value) {
      roles.value = res.data.value as Array<Roles>;
    }
    rolesNames.value = roles.value.map((role) => role.description);
  }

  return { roles, rolesNames, fetchRoles };
});
