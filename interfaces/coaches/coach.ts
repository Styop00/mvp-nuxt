export default interface Coach {
  [x: string]: any;
  id: number;
  license: number;
  personId: number;
  level: string;
  start: string | null;
  end: string | null;
  masterLicense: string;
  createdAt: Date;
  updatedAt: Date;
  person: {
    name: string;
    email: string;
    userId: number;
    [key: string]: any;
    user: {
      user_roles: {
        teamId: number;
        roleId: number;
        team: {
          localName: string;
          deleted: boolean;
          [key: string]: any;
          tournaments: {
            name: string;
            shortName: string;
            [key: string]: any;
          };
          club: {
            name: string;
            [key: string]: any;
          };
          tournaments: {
            shortName: string;
            [key: string]: any;
          }[];
        };
        club: {
          name: string;
        };
        role: {
          description: string;
          [key: string]: any;
        };
      }[];
    };
  };
  coachEducation: {
    id: number;
    module: string;
    date: string;
    comment: string;
    hours: number;
    coachId: number;
    mvp: number;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    coachEducationLicenseTypes: {
      coachLicenseTypeId: number;
    }[];
  }[];
  coachLicenses: CoachLicense[];
  coachHistories: CoachHistory[];
}

export interface CoachLicense {
  id: number;
  coachLicenseTypeId: number;
  start: string;
  end: string;
  deleted: boolean;
  coachId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoachHistory {
  id: number;
  teamId: number;
  clubName: string;
  tournamentName: string;
  seasonName: string;
  coachId: number;
  mvp: number;
  team: {
    localName: string;
  };
}
