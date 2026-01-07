export default interface TeamsTable {
    id: Number,
    name: String,
    license: String | Number,
    localName: String | null;
    coaches: String,
    enough: String | null;
}