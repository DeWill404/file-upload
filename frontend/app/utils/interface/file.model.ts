import * as tus from "tus-js-client";

export enum FileStatus {
  STARTED = 1,
  FAILED = 2,
  CANCELED = 3,
  COMPLETED = 4,
}

export interface FileAccessModel {
  is_public: boolean;
  shared_with: number[];
  url?: string;
}

export interface FileListingModel {
  id: number;
  name: string;
  size: number;
  owner_name: string;
  upload_status: FileStatus;
  access: FileAccessModel;
  created_on: Date;
  updated_on: Date;
  is_deleted: boolean;
}

export interface FileListingResponseModel {
  data: FileListingModel[];
  uploadData: FileUploadModel[];
  count: number;
}

export interface FileUploadModel {
  file_id: number;
  progress: number;
  status: FileStatus;
  url?: string;
  tusClient?: tus.Upload;
}
