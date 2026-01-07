import type SelectOptions from "~/interfaces/inputs/selectOptions";

export const officialTypes = [
    {
        label: 'Set by club manager',
        value: 0,
        disabled: false
    },
    {
        label: 'Set by team manager',
        value: 1,
        disabled: false
    },
    {
        label: 'Set by other club manager',
        value: 2,
        disabled: false
    },
] as Array<SelectOptions>