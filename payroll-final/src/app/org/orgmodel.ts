export interface ISalaryGroupCondition {
    id: number;
    sId: number;
    oAHId: number;
    oADId: number;
    oADCode: string;
    oP: string;
    cO: string;
  }
  
  // Interface for the Main Data Structure
  export interface IOrgData {
    id: number;
    cd: string;
    ds: string;
    st: string;
    salaryGroupConditionListDto: ISalaryGroupCondition[];
  }

  export interface OrgHeader {
    id: number;
    at: string;
    cd: string;
    ds: string;
    st: string;
  }
  
  export interface OrgValue {
    id: number;
    oId: number;
    cd: string;
    ds: string;
    st: string;
  }