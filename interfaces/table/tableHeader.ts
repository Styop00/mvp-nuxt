export default interface TableHeader {
    label: String,
    dataKey?: String,
    sortable: Boolean,
    sortValue: String | null,
    clickable?: boolean,
    className?: string,
}