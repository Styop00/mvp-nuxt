const moduleOptions: Array<{
  label: string;
  value: string;
  disabled: boolean;
}> = [];

const modulesData: string[] = [
  "Andet",
  "A-træner - Modul 1",
  "A-træner - Modul 2",
  "A-træner - Modul 3",
  "Diplomtræner",
  "ITA",
  "Niveau 3 - Grundmodul",
  "Niveau 3 - Tillægsmodul 1",
  "Niveau 3 - Tillægsmodul 2",
  "Niveau 3 - Tillægsmodul 3",
  "Niveau 3 - Tillægsmodul 4",
  "Ny som træner 2 - Tillægsmodul 2",
  "SMART Træner 1 - Grundmodul",
  "SMART Træner 1 - Tillægsmodul",
  "SMART Træner 2 - Grundmodul",
  "SMART Træner 2 - Tillægsmodul",
];

modulesData.forEach((module) => {
  moduleOptions.push({
    label: module,
    value: module,
    disabled: false,
  });
});

export default moduleOptions;
