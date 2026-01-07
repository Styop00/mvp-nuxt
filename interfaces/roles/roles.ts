import type UserRole from "~/interfaces/users/userRole";

export default interface Roles {
  id: number;
  value: string;
  description: string;
  user_roles?: UserRole;
}
