import {
  Box,
  CircularProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { FileTableContext } from "./FileTable";
import { FileTableContextProps } from "@/app/utils/interface/file-listing.model";

export default function EmptyRows({ isLoading }: { isLoading: boolean }) {
  const {
    rows,
    headCells,
    page: { rowsPerPage },
  } = useContext(FileTableContext) as FileTableContextProps;

  const emptyRows = isLoading
    ? rowsPerPage
    : Math.max(0, rowsPerPage - rows.length);

  if (emptyRows === 0) return null;
  return (
    <TableRow style={{ height: 53 * emptyRows }}>
      <TableCell colSpan={headCells.length + 1}>
        {emptyRows === rowsPerPage && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
          >
            {isLoading ? (
              <>
                <CircularProgress size={40} />
                <Typography variant="h6">Loading...</Typography>
              </>
            ) : (
              <Typography variant="h6">No data found</Typography>
            )}
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
}
