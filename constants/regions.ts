import type SelectOptions from "~/interfaces/inputs/selectOptions";

export const regionOptions = [
  { value: "0", label: "--All of DK--", disabled: false },
  { value: "1", label: "East", disabled: false },
  { value: "10", label: "East 0-1999", disabled: false },
  { value: "11", label: "East 2000-2999", disabled: false },
  { value: "2", label: "East 0-2999", disabled: false },
  { value: "3", label: "East 3000-4999", disabled: false },
  { value: "4", label: "West", disabled: false },
  { value: "5", label: "West 5000-5999", disabled: false },
  { value: "7", label: "West 6000-6999", disabled: false },
  { value: "12", label: "West 7000-7999", disabled: false },
  { value: "13", label: "West 8000-8999", disabled: false },
  { value: "8", label: "West 7000-8999", disabled: false },
  { value: "9", label: "West 9000-9999", disabled: false },
] as SelectOptions[];
