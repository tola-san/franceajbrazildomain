export interface BaseResponse<T> {
  message: string
  status?: string
  total?: number
  result?: number
  data: T
  uniqueTags?: string[]
  paginatorInfo?: PaginatorInfo
}

export interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}
