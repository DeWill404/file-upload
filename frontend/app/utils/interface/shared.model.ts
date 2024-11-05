export interface APIResponse<T> {
  success: boolean;
  data?: T;
}

export interface AxiosResponse<T> {
  message: string;
  data?: T;
}

export enum SnackbarType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface SnackbarDetails {
  message: string;
  severity: SnackbarType;
  id?: string;
}

export interface FileUploadWatchModel {
  isWatching: boolean;
  errCount: number;
  fileCount: number;
  watchList: number[];
}
