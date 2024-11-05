import { Box, Fade, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, RefObject, useEffect, useState } from "react";
import { sx } from "./styles";
import { Upload } from "@mui/icons-material";
import { showSnackbar } from "../SnackbarProvider";
import { SnackbarType } from "../../interface/shared.model";

export interface DragnDropContainerProps {
  inputRef: RefObject<HTMLInputElement>;
  uploadFilesOnServer: (files: File[]) => void;
}

export default function DragnDropContainer({
  inputRef,
  uploadFilesOnServer,
}: DragnDropContainerProps) {
  const [showDragNDrop, setShowDragNDrop] = useState(false);

  useEffect(() => {
    const showDrag = () => setShowDragNDrop(true);
    const hideDrag = () => setShowDragNDrop(false);

    window.addEventListener("dragover", showDrag);
    window.addEventListener("dragleave", hideDrag);
    window.addEventListener("drop", hideDrag);

    return () => {
      window.removeEventListener("dragover", showDrag);
      window.removeEventListener("dragleave", hideDrag);
      window.removeEventListener("drop", hideDrag);
    };
  }, []);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(
      (file) => file.type === "text/csv"
    );

    if (files.length === 0) {
      showSnackbar({
        message: "Please select a CSV file",
        severity: SnackbarType.ERROR,
      });
      return;
    }

    uploadFilesOnServer(files);
  };

  return (
    <Fade in={showDragNDrop}>
      <Box sx={sx.dragNDropContainer}>
        <Box sx={sx.dragNDrop}>
          <Typography variant="h5" fontWeight="bold">
            Drop here to start uploading
          </Typography>
          <Upload fontSize="large" />
        </Box>
        <TextField
          type="file"
          hidden
          inputProps={{ multiple: true, ref: inputRef, accept: "text/csv" }}
          sx={sx.dragInput}
          onChange={onInputChange}
        />
      </Box>
    </Fade>
  );
}
