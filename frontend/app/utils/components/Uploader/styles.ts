import { SxProps } from "@mui/material";

export const sx: { [key: string]: SxProps } = {
  containerWrapper: {
    position: "fixed",
    bottom: 20,
    right: 0,
    width: "100%",
    zIndex: 1100,
  },
  container: { display: "flex", justifyContent: "flex-end" },
  mainContainer: {
    borderRadius: "25%",
    transition: "all linear 0.3s",
    "&.expanded": { borderRadius: 2 },
    overflow: "hidden",
    border: `1px solid hsla(210, 14%, 28%, 0.3)`,
  },
  uploadButton: { minWidth: "auto", padding: 1.75, borderRadius: "25%" },
  dragNDropContainer: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: "100%",
    height: "100%",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dragNDrop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 2,
    textAlign: "center",
    border: "2px dashed #000",
    width: "clamp(200px, 80%, 600px)",
    height: "clamp(300px, 80%, 400px)",
    borderRadius: 10,
  },
  dragInput: {
    opacity: 0,
    "& input": {
      position: "fixed",
      width: "100%",
      height: "100%",
      inset: 0,
      padding: 0,
    },
  },
  uploadingHeaderContainer: {
    width: "300px",
    maxWidth: "300px",
  },
  headerUploadButton: {
    minWidth: "auto",
    paddingInline: 1.5,
  },
  uploadingHeaderText: {
    textTransform: "none",
    textAlign: "left",
    justifyContent: "space-between",
    pointerEvents: "none",
    flexGrow: 1,
  },
  uploadListContainer: {
    width: "300px",
    maxWidth: "300px",
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
    borderTop: `1px solid hsla(210, 14%, 28%, 0.3)`,
  },
  uploadListItem: {
    padding: 1,
    paddingLeft: 2,
  },
  uploadListItemText: {
    wordBreak: "keep-all",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
};
