export default interface UserRole {
    id: number;
    userId: number;
    roleId: number;
    clubId: number | null;
    teamId: number | null;
    seasonSportId: number | null;
    userRoleApprovedByUserId: number | null;
    user_rolespec: string | null;
}
