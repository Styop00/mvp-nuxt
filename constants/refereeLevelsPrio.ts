import type SelectOptions from "~/interfaces/inputs/selectOptions";

export const refereeLevels: Array<SelectOptions> = [
  {
    label: "1: BL + LPH",
    value: "1",
    disabled: false,
  },
  {
    label: "2: KBL + LPK",
    value: "2",
    disabled: false,
  },
  {
    label: "3: 1DH + DPH",
    value: "3",
    disabled: false,
  },
  {
    label: "4: HU19Liga + HU23",
    value: "4",
    disabled: false,
  },
  {
    label: "5: KU19Liga + HU17Liga + HU191D",
    value: "5",
    disabled: false,
  },
  {
    label: "6: Seniors 1DK + 2DH + 3DH + DPK",
    value: "6",
    disabled: false,
  },
  {
    label: "7: KU17Liga + HU171D + U15 + U13",
    value: "7",
    disabled: false,
  },
] as Array<SelectOptions>;

export const refereeLevelsBasketball: Array<SelectOptions> = [
  {
    label: "--Alle Niveauer--",
    value: "0",
    disabled: false,
  },
  {
    label: "1: FL og KL",
    value: "1",
    disabled: false,
  },
  {
    label: "2: 1.Div og KL",
    value: "2",
    disabled: false,
  },
  {
    label: "3: 2.div, U18 og KL",
    value: "3",
    disabled: false,
  },
  {
    label: "4: 3. div og 1. division kvinder",
    value: "4",
    disabled: false,
  },
  {
    label: "5: Serier",
    value: "5",
    disabled: false,
  },
];

export const levelOptionsOther: SelectOptions[] = [
  { value: "-2", label: "Level 1 - 3", disabled: false },
  { value: "-6", label: "Level 1 - 4", disabled: false },
  { value: "-4", label: "Level 4 - 7", disabled: false },
  { value: "-5", label: "Level 5 - 7", disabled: false },
  { value: "-1", label: "Level 1 - 7", disabled: false },
];

export const levelOptionsInRefereeAttachmentPage: SelectOptions[] = [
  { value: "0", label: "--Vælg--", disabled: false },
  { value: "1", label: "1: BL og Landspokal Herrer", disabled: false },
  { value: "2", label: "2: KBL og Landspokal Kvinder", disabled: false },
  { value: "3", label: "3: 1.Div Herrer, og U19 Drenge", disabled: false },
  {
    value: "4",
    label: "4: 1.Div Kvinder, 2. Div Herrer, U17 Ligaer og U19 Piger",
    disabled: false,
  },
  {
    value: "5",
    label: "5: U15 Mester, 3. Div Herrer, 2. Div Kvinder og U13 Mester",
    disabled: false,
  },
  { value: "-3", label: "Level 3 - 5", disabled: false },
  { value: "-1", label: "Level 1 - 5", disabled: false },
  { value: "6", label: "6: Serier, A rækker og U13 Mester", disabled: false },
  { value: "7", label: "7: Kørestol", disabled: false },
  { value: "10", label: "Alle 1-4", disabled: false },
];
