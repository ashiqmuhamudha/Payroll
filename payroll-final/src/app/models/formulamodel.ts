export interface IForData {
   

    id: number;
    cd: string;
    ds: string;
    sid: number;
    fr: string;
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

  export interface IForDataList {
    items: IForData[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }