export default interface LeaguesTableData {
    id: Number
    name: String
    start: Date
    end: Date
    organizer: Object | null
    clubId: number | null
}