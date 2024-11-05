import { Box, Button, Container, Fade, Grow, Paper } from "@mui/material";
import { sx } from "./styles";
import { useContext, useMemo, useRef, useState } from "react";
import useTusClient, { TusUploadContext } from "./useTusClient";
import { getUploadInProgressCnt } from "./utils";
import UploadingHeader from "./uploading-header";
import DragnDropContainer from "./drag-n-drop";
import { Upload } from "@mui/icons-material";
import UploadList from "./upload-list";
import { FileTableColumns } from "../../interface/file-listing.model";

export default function Uploader({
  allData,
  reload,
}: {
  allData: FileTableColumns[];
  reload: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useTusClient({
    onComplete: (isSuccess: boolean) => {
      if (isSuccess && fileUploadList.length === 0) {
        setIsCollapsed(true);
      }
      reload();
    },
    onStart: (file_id: number) => {
      setIsUploading((prev) => ({ ...prev, [file_id]: true }));
    },
    inputRef,
  });
  const uploadFilesOnServer = (files: File[]) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) startUpload(files[i]);
    if (inputRef.current) {
      const input = inputRef.current;
      input.multiple = true;
      delete input.dataset.file_id;
      input.value = "";
    }
    setIsCollapsed(false);
  };

  const fileUploadList = useContext(TusUploadContext)[0];
  const [pendingCount, isPending] = useMemo(
    () => getUploadInProgressCnt(fileUploadList),
    [fileUploadList]
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>(
    {}
  );

  return (
    <Box sx={sx.containerWrapper}>
      <Container sx={sx.container}>
        <Grow in>
          <Paper
            elevation={3}
            sx={sx.mainContainer}
            className={isPending ? "expanded" : ""}
          >
            <Fade
              in={!isPending}
              timeout={{ enter: 500, exit: 0 }}
              unmountOnExit
            >
              <Button
                color="inherit"
                variant="contained"
                sx={sx.uploadButton}
                onClick={() => inputRef.current?.click()}
              >
                <Upload />
              </Button>
            </Fade>
            <Fade
              in={isPending}
              timeout={{ enter: 500, exit: 0 }}
              unmountOnExit
            >
              <div>
                <UploadingHeader
                  inputRef={inputRef}
                  pendingCount={pendingCount}
                  isCollapsed={isCollapsed}
                  setCollapse={setIsCollapsed}
                />
                <UploadList
                  allData={allData}
                  isCollapsed={isCollapsed}
                  inputRef={inputRef}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              </div>
            </Fade>
          </Paper>
        </Grow>
        <DragnDropContainer
          inputRef={inputRef}
          uploadFilesOnServer={uploadFilesOnServer}
        />
      </Container>
    </Box>
  );
}
