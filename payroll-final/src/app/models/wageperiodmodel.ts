export interface IWagePeriod {
  id: number;
  cd: string; 
  wF: string; 
  wT: string; 
  st: string; 
  tF: string; 
  tT: string; 
  pT: string; 
  pM: string; 
  sM: number; 
  cM: string; 
  cuD: number;  
}

export interface IWagePeriodList {
  items: IWagePeriod[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

