export interface ITaxinfoData {
   

    id: number;
    tGn: string;
    cd: string;
    ds: string;
    sIc: string;
    do: number;
    
   
  }

  export interface ITaxinfoDataList {
      items: ITaxinfoData[];
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }