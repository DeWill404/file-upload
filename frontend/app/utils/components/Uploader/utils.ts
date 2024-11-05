import { Dispatch, SetStateAction } from "react";
import { FileStatus, FileUploadModel } from "../../interface/file.model";
import {
  FileUploadWatchModel,
  SnackbarType,
} from "../../interface/shared.model";
import { showSnackbar } from "../SnackbarProvider";

export const getUploadInProgressCnt = (
  fileUploadList: FileUploadModel[]
): [number, boolean] => {
  const pendingCount = fileUploadList.filter(
    (f: FileUploadModel) =>
      ![FileStatus.COMPLETED, FileStatus.CANCELED].includes(f.status)
  ).length;
  return [pendingCount, pendingCount > 0];
};

export const getAveragePercentage = (
  fileUploadList: FileUploadModel[]
): number => {
  const filteredList = fileUploadList.filter(
    (upload) => upload.status === FileStatus.STARTED
  );
  const total = filteredList.reduce(
    (acc: number, f: FileUploadModel) => acc + f.progress,
    0
  );
  return filteredList.length ? total / filteredList.length : 0;
};

export const startWatchingUploads = (
  fileId: number,
  watchSetter: Dispatch<SetStateAction<FileUploadWatchModel>>
) => {
  watchSetter((prev) => {
    const watchList = [...prev.watchList, fileId];
    return {
      ...prev,
      isWatching: true,
      watchList,
      fileCount: watchList.length,
    };
  });
};

export const updateWatchList = (
  fileId: number,
  isSuccess: boolean,
  watchSetter: Dispatch<SetStateAction<FileUploadWatchModel>>,
  onCompleteCallback: (isSuccess: boolean) => void
) => {
  watchSetter((prev) => {
    if (!prev.isWatching) {
      return prev;
    }

    const watchModel = {
      ...prev,
      watchList: prev.watchList.filter((id) => id !== fileId),
    };

    watchModel.errCount += isSuccess ? 0 : 1;
    watchModel.fileCount = watchModel.watchList.length;

    if (watchModel.fileCount === 0) {
      if (watchModel.errCount === 0) {
        showSnackbar({
          message: "All files uploaded successfully",
          severity: SnackbarType.SUCCESS,
          id: "upload-status",
        });
      } else {
        showSnackbar({
          message: "Some files failed to upload",
          severity: SnackbarType.ERROR,
          id: "upload-status",
        });
      }
      onCompleteCallback(watchModel.errCount === 0);
      watchModel.isWatching = false;
      watchModel.errCount = 0;
      watchModel.fileCount = 0;
      watchModel.watchList = [];
    }

    return watchModel;
  });
};
