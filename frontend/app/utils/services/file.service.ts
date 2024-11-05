import { AxiosError } from "axios";
import { APIResponse, AxiosResponse } from "../interface/shared.model";
import { axios, handleAuthenticationError, handleAxiosError } from "./axios";
import { FileListingResponseModel, FileStatus } from "../interface/file.model";

export async function createFile(
  fileName: string,
  fileSize: number
): Promise<APIResponse<number>> {
  const apiResponse: APIResponse<number> = {
    success: false,
  };

  try {
    const res = await axios.post<AxiosResponse<{ file_id: number }>>(
      "/files/create",
      {
        name: fileName,
        size: fileSize,
      }
    );
    apiResponse.success = true;
    apiResponse.data = res.data.data?.file_id as number;
  } catch (error) {
    handleAxiosError(error as AxiosError);
    handleAuthenticationError(error as AxiosError);
    apiResponse.success = false;
  }

  return apiResponse;
}

export async function updateFileUploadStatus(
  fileId: number,
  updateStatus: FileStatus,
  fileURL?: string
): Promise<APIResponse<void>> {
  const apiResponse: APIResponse<void> = {
    success: false,
  };

  try {
    await axios.put<AxiosResponse<void>>("/files/update-status", {
      file_id: fileId,
      status: updateStatus,
      url: fileURL,
    });
    apiResponse.success = true;
  } catch (error) {
    handleAxiosError(error as AxiosError);
    handleAuthenticationError(error as AxiosError);
    apiResponse.success = false;
  }

  return apiResponse;
}

export async function getAllFiles(
  pageNumber: number,
  pageSize: number,
  loadUploadData: boolean
): Promise<APIResponse<FileListingResponseModel>> {
  const apiResponse: APIResponse<FileListingResponseModel> = {
    success: false,
  };

  try {
    const res = await axios.get<AxiosResponse<FileListingResponseModel>>(
      `/files/list?page=${pageNumber}&size=${pageSize}&loadUploadData=${loadUploadData}`
    );
    apiResponse.success = true;
    apiResponse.data = res.data.data as FileListingResponseModel;
  } catch (error) {
    handleAxiosError(error as AxiosError);
    handleAuthenticationError(error as AxiosError);
    apiResponse.success = false;
  }

  return apiResponse;
}
