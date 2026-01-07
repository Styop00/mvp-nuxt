export default interface BlockedPeriodsTable {
    id: number;
    title: string;
    description: string;
    startDate: Date | String | null;
    endDate: Date | String | null;
    tournamentsCount: string;
}