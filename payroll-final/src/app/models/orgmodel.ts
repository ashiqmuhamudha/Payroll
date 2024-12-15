export interface ISalaryGroupCondition {
  id: number;
  sId: number;
  oAHId: number;
  oADId: number;
  oADCode: string;
  oP: string;
}

// Interface for the Main Data Structure
export interface ISalaryData {
  id: number;
  cd: string;
  ds: string;
  st: string;
  salaryGroupConditionListDto: ISalaryGroupCondition[];
}

export interface ISalaryList {
  items: ISalaryData[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrgHeader {
  id: number;
  at: string;
  cd: string;
  ds: string;
  st: string;
}

export interface OrgDetail {
  id: number;
  oId: number;
  cd: string;
  ds: string;
  st: string;
}

export interface IOrgDetail {
  items: OrgDetail[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}