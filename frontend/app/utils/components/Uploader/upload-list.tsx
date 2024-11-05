import { useContext, useEffect, useState } from "react";
import { TusUploadContext } from "./useTusClient";
import { FileTableColumns } from "../../interface/file-listing.model";
import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { sx } from "./styles";
import { FileStatus } from "../../interface/file.model";
import { Close, Pause, PlayArrow, Replay } from "@mui/icons-material";
import { updateFileUploadStatus } from "../../services/file.service";
import { getUserToken } from "../../services/auth.service";
import * as tus from "tus-js-client";

export interface UploadListProps {
  allData: FileTableColumns[];
  isCollapsed: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isUploading: { [key: number]: boolean };
  setIsUploading: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >;
}

export default function UploadList({
  allData,
  isCollapsed,
  inputRef,
  isUploading,
  setIsUploading,
}: UploadListProps) {
  const [uploadList, updateFileUploadList] = useContext(TusUploadContext);

  const [fileList, setFileList] = useState<FileTableColumns[]>([]);

  useEffect(() => {
    if (uploadList.length) {
      const fileteredList = uploadList.filter(
        (u) => u.status === FileStatus.STARTED || u.status === FileStatus.FAILED
      );

      const fileStatusList = fileteredList.map((u) => {
        const file = allData.find((data) => u.file_id === data.id);
        if (file) {
          return {
            ...file,
            upload_status: u,
            access: { ...file.access, url: u.url },
          };
        }
        return {
          id: u.file_id,
          name: (u.tusClient?.file as File).name,
          size: (u.tusClient?.file as File).size,
          owner: getUserToken()?.name || "",
          upload_date: new Date().toDateString(),
          access: { is_public: false, shared_with: [], url: u.url },
          upload_status: u,
          delete_date: "",
          action: null,
        };
      });
      setFileList(fileStatusList);
    }
  }, [uploadList, allData]);

  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  const onCancel = async (file: FileTableColumns) => {
    if (file.upload_status?.tusClient) {
      try {
        await file.upload_status?.tusClient.abort();
      } catch (error) {
        console.error("Failed to cancel upload: ", error);
      }
    }

    setIsLoading((prev) => ({ ...prev, [file.id]: true }));
    const res = await updateFileUploadStatus(file.id, FileStatus.CANCELED);
    setIsLoading((prev) => ({ ...prev, [file.id]: false }));

    if (res.success) {
      updateFileUploadList((prev) =>
        prev.map((_file) => {
          if (_file.file_id === file.id) {
            return { ..._file, status: FileStatus.CANCELED };
          }
          return _file;
        })
      );
    }
  };

  const handleReplay = async (file: FileTableColumns) => {
    let client: tus.Upload;
    if (file.upload_status?.tusClient) {
      client = file.upload_status.tusClient;

      const prevUploads = await client.findPreviousUploads();
      if (prevUploads && prevUploads.length) {
        client.resumeFromPreviousUpload(prevUploads[0]);
        client.start();
        setIsUploading((prev) => ({ ...prev, [file.id]: true }));
        return;
      }
    }

    if (inputRef.current) {
      const input = inputRef.current;
      input.multiple = false;
      input.dataset.file_id = file.id.toString();
      input.click();
    }
  };

  const handlePause = async (file: FileTableColumns) => {
    try {
      file.upload_status?.tusClient?.abort();
      setIsUploading((prev) => ({ ...prev, [file.id]: false }));
    } catch (error) {
      console.error("Failed to pause upload: ", error);
    }
  };

  return (
    <Collapse in={fileList.length > 0 && !isCollapsed}>
      <Box sx={sx.uploadListContainer}>
        <List>
          {fileList.map((file, index) => (
            <ListItem divider key={index} sx={sx.uploadListItem}>
              <Box width={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  width={1}
                >
                  <Typography variant="body1" sx={sx.uploadListItemText}>
                    {file.name}
                  </Typography>
                  <Box display="flex">
                    {file.upload_status?.status === FileStatus.STARTED ? (
                      isUploading[file.id] ? (
                        <IconButton
                          size="small"
                          onClick={() => handlePause(file)}
                        >
                          <Pause />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => handleReplay(file)}
                        >
                          <PlayArrow />
                        </IconButton>
                      )
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => handleReplay(file)}
                      >
                        <Replay />
                      </IconButton>
                    )}
                    <IconButton
                      disabled={isLoading[file.id]}
                      size="small"
                      onClick={() => onCancel(file)}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
                {file.upload_status?.status === FileStatus.STARTED &&
                  file.upload_status.progress > 0 && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          minWidth: "48px",
                          width: "48px",
                          display: "block",
                        }}
                      >
                        {file.upload_status?.progress} %
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        color="inherit"
                        value={file.upload_status?.progress || 0}
                        sx={{ flexGrow: 1, borderRadius: 5, height: "8px" }}
                      />
                    </Box>
                  )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Collapse>
  );
}
