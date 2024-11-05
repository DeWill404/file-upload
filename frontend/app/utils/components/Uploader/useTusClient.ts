import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as tus from "tus-js-client";
import { FileStatus, FileUploadModel } from "../../interface/file.model";
import {
  createFile,
  updateFileUploadStatus,
} from "../../services/file.service";
import { getFileServerUrl } from "../../read-env";
import { FileUploadWatchModel } from "../../interface/shared.model";
import { startWatchingUploads, updateWatchList } from "./utils";

export const TusUploadContext = createContext<
  [FileUploadModel[], Dispatch<SetStateAction<FileUploadModel[]>>]
>([[], () => {}]);

export interface TusClientProps {
  onComplete: (isSuccess: boolean) => void;
  onStart: (file_id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function useTusClient({
  onComplete,
  onStart,
  inputRef,
}: TusClientProps) {
  const [fileUploadList, updateFileUploadList] = useContext(TusUploadContext);
  const curretList = useRef<FileUploadModel[]>([]);
  useEffect(() => {
    curretList.current = fileUploadList;
  }, [fileUploadList]);

  const setWatcher = useState<FileUploadWatchModel>({
    isWatching: false,
    errCount: 0,
    fileCount: 0,
    watchList: [],
  })[1];

  const _handleFileError = async (
    file_id: number,
    error: Error | tus.DetailedError
  ) => {
    console.error("Failed because: " + error + ", for file_id: " + file_id);
    updateFileUploadList((prev) =>
      prev.map((file) => {
        if (file.file_id === file_id) {
          return { ...file, progress: 0, status: FileStatus.FAILED };
        }
        return file;
      })
    );
    await updateFileUploadStatus(file_id, FileStatus.FAILED);
    updateWatchList(file_id, false, setWatcher, onComplete);
  };

  const _handleFileProgress = async (
    file_id: number,
    bytesUploaded: number,
    bytesTotal: number
  ) => {
    const uploadList = curretList.current;
    const uploadModel = uploadList.find((f) => f.file_id === file_id);
    if (!uploadModel) return;
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    updateFileUploadList((prev) =>
      prev.map((file) => {
        if (file.file_id === file_id) {
          return { ...file, progress: parseFloat(percentage) };
        }
        return file;
      })
    );
  };

  const _handleFileSuccess = async (
    file_id: number,
    payload: tus.OnSuccessPayload
  ) => {
    let url = payload.lastResponse.getUnderlyingObject().responseURL;
    url = "/" + url.split("/").slice(-1)[0];
    updateFileUploadList((prev) =>
      prev.map((file) => {
        if (file.file_id === file_id) {
          return {
            ...file,
            url: url,
            progress: 0,
            status: FileStatus.COMPLETED,
          };
        }
        return file;
      })
    );
    await updateFileUploadStatus(file_id, FileStatus.COMPLETED, url);
    updateWatchList(file_id, true, setWatcher, onComplete);
  };

  const _clientOption = (file_id: number) => ({
    endpoint: getFileServerUrl(),
    retryDelays: null,
    onError: (error: tus.DetailedError | Error) =>
      _handleFileError(file_id, error),
    onProgress: (bytesUploaded: number, bytesTotal: number) =>
      _handleFileProgress(file_id, bytesUploaded, bytesTotal),
    onSuccess: (payload: tus.OnSuccessPayload) =>
      _handleFileSuccess(file_id, payload),
  });

  const startUpload = async (file: File) => {
    let file_id: number = 0;
    let isRetry = false;

    if (inputRef.current) {
      const input = inputRef.current;
      const id = input.dataset.file_id;
      if (id && !isNaN(parseInt(id))) {
        file_id = parseInt(id);
        isRetry = true;
      }
    }

    if (!isRetry) {
      const res = await createFile(file.name, file.size);
      if (!res.success) return;
      file_id = res.data as number;
    }

    const tusClient = new tus.Upload(file, _clientOption(file_id));
    tusClient.options.metadata = {
      filename: file.name,
      filetype: file.type,
    };

    if (isRetry) {
      updateFileUploadList((prev) =>
        prev.map((file) => {
          if (file.file_id === file_id) {
            return {
              ...file,
              status: FileStatus.STARTED,
              tusClient: tusClient,
            };
          }
          return file;
        })
      );
    } else {
      const uploadModel: FileUploadModel = {
        file_id: file_id,
        progress: 0,
        tusClient: tusClient,
        status: FileStatus.STARTED,
      };
      updateFileUploadList((prev) => [uploadModel, ...prev]);
    }

    setTimeout(() => {
      startWatchingUploads(file_id, setWatcher);
      tusClient.start();
      onStart(file_id);
    }, 0);
  };

  return { startUpload };
}
