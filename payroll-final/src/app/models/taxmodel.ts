export interface ITaxData {
   

    id: string;
    nm: string;
    cd: string;
    ds: string;
    st: string;
    
   
  }

  export interface ITaxDataList {
      items: ITaxData[];
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }