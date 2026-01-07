export default interface Conflict {
    blockedAssociation?: string;
    blockedTeam?: string;
    coaches: string;
    createdAt: Date;
    deletedAt?: Date;
    gameId: number;
    gamesOnCourt: string;
    gamesToClose: string;
    hasCourt: string;
    id: number;
    ignoreAssociations: boolean;
    ignoreAway: boolean;
    ignoreHome: boolean;
    reservations: string;
    startTime: string;
}