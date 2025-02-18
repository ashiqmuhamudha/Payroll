export interface IBaseData {
   

    id: number;
    cd: string;
    ds: string;
    sid: number;
    ty: string;
    pr: string;
    ar: string;
    pp: string;
    ppo: number;
    fe: string;
    ont: string;
    tc: string;
    tcc: string;
   
  }

  export interface IBaseDataList {
    items: IBaseData[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }