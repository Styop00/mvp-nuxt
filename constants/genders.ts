import type SelectOptions from "~/interfaces/inputs/selectOptions";

export const genders = [
    {
        label: 'Man',
        value: 'M',
        disabled: false
    },
    {
        label: 'Women',
        value: 'W',
        disabled: false
    },
    {
        label: 'Both',
        value: 'B',
        disabled: false
    },
] as Array<SelectOptions>