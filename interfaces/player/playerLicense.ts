export default interface PlayerLicense {
    id: number;
    clubId: number | null;
    clubName: string | null;
    start: string | Date;
    end: string | Date;
    playerId: number;
    seasonSportId: number;
    onContract: number;
    identityId: number;
    status: string;
}