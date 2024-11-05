import { KeyboardArrowUp, Upload } from "@mui/icons-material";
import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { sx } from "./styles";
import { useContext, useMemo } from "react";
import { TusUploadContext } from "./useTusClient";
import { getAveragePercentage } from "./utils";

export interface UploadingHeaderProps {
  pendingCount: number;
  inputRef: React.RefObject<HTMLInputElement>;
  isCollapsed: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function UploadingHeader({
  pendingCount,
  inputRef,
  isCollapsed,
  setCollapse,
}: UploadingHeaderProps) {
  const fileUploadList = useContext(TusUploadContext)[0];

  const averagePercentage = useMemo(
    () => getAveragePercentage(fileUploadList),
    [fileUploadList]
  );

  return (
    <ButtonGroup
      variant="text"
      size="large"
      color="inherit"
      sx={sx.uploadingHeaderContainer}
    >
      <Button
        color="inherit"
        variant="contained"
        sx={sx.headerUploadButton}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
      </Button>
      <Button tabIndex={-1} sx={sx.uploadingHeaderText}>
        <span>{pendingCount} files pending</span>

        {(pendingCount > 1 || isCollapsed) && (
          <CircularProgress
            size={32}
            variant="determinate"
            value={averagePercentage}
          />
        )}
      </Button>
      <Button
        sx={{ rotate: isCollapsed ? "180deg" : 0 }}
        onClick={() => setCollapse((p) => !p)}
      >
        <KeyboardArrowUp />
      </Button>
    </ButtonGroup>
  );
}
