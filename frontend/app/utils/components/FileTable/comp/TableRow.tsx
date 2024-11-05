import {
  FileTableContextProps,
  RowProps,
} from "@/app/utils/interface/file-listing.model";
import MuiTableRow from "@mui/material/TableRow";
import { useContext } from "react";
import { FileTableContext } from "./FileTable";
import { Box, TableCell } from "@mui/material";
import Link from "next/link";
import { OpenInNew } from "@mui/icons-material";

export default function TableRow({ row }: RowProps) {
  const {
    headCells,
    select: { selected },
  } = useContext(FileTableContext) as FileTableContextProps;

  const isItemSelected = selected.includes(row.id);

  const formatSize = (size: number) => {
    if (size >= 1073741824) {
      return (size / 1073741824).toFixed(2) + " GB";
    } else if (size >= 1048576) {
      return (size / 1048576).toFixed(2) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return size + " Bytes";
    }
  };

  const generateLink = () => {
    if (!row.access.url) {
      return row.name;
    }
    return (
      <Box
        component={Link}
        href={`/preview${row.access.url}?fileName=${encodeURI(row.name)}`}
        target="_blank"
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ "&:hover": (theme) => ({ color: theme.palette.primary.dark }) }}
      >
        {row.name} <OpenInNew fontSize="small" />
      </Box>
    );
  };

  return (
    <MuiTableRow selected={isItemSelected}>
      {headCells.map((hCell, index) => (
        <TableCell key={index}>
          {hCell.id === "size"
            ? formatSize(row[hCell.id])
            : hCell.id === "name"
            ? generateLink()
            : (row[hCell.id] as string)}
        </TableCell>
      ))}
    </MuiTableRow>
  );
}
