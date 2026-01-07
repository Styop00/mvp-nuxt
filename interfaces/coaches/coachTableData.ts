export default interface CoachTableData {
  id: number;
  name: string;
  license: number;
  status: boolean;
  email: string;
  level: string;
  activeForTeam: string;
  latestCourse: string;
}

export interface CoachActiveTeamsTableData {
  association: string;
  team: string;
  enough: string;
  roles: string;
}

export interface CoachFormerTeamsTableData {
  association: string;
  team: string;
  row: string;
  season: string;
}

export interface CoachCoursesTableData {
  id: number,
  module: string;
  date: string;
  comment: string;
  hours: number;
  licenses: string;
}
