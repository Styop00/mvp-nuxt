export default interface TimeSlotsTable {
    id: Number,
    court: String,
    day: String,
    date: String;
    expiration: String;
    club?: String,
    status?: String,
    reservations: String | null;
}