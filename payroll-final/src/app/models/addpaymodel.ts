export interface IAddPayData {
   

    id: number;
    cd: string;
    ds: string;
    sid: number;
    ty: string;
    pp: string;
    ppo: number;
    fe: string;
    ont: string;
    cf: string;
    tc: string;
    tcc: string;
   
  }

  export interface IAddPayDataList {
    items: IAddPayData[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }