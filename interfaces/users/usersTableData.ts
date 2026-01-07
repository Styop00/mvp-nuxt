export default interface UsersTableData {
  id: number;
  email: string;
  name?: string;
  isVerified: boolean;
  roles?: string;
}
