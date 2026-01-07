export default interface CoachEducation {
  id: number | undefined;
  educationId: number | undefined;
  module: string;
  licenseM: boolean;
  licenseB: boolean;
  licenseT: boolean;
  hours: number | null;
  date: string;
  coachId: number | null;
  coaches?: { [key: number]: { name: string; email: string } };
  comment?: string;
}

export interface CoachEducationGet {
  id: number;
  module: string;
  hours: number | null;
  date: string;
  comment?: string;
  coachId: number;
  deleted: boolean;
  coachEducationLicenseTypes: {
    id: number;
    coachLicenseTypeId: number;
    coachEducationId: number;
  }[];
}
