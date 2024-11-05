import MuiTableHead from "@mui/material/TableHead";
import {
  FileTableContextProps,
  HeaderSortProps,
  SortHandlerFunction,
} from "@/app/utils/interface/file-listing.model";
import { Box, TableCell, TableRow, TableSortLabel } from "@mui/material";
import { useContext } from "react";
import { FileTableContext } from "./FileTable";
import { visuallyHidden } from "@mui/utils";

const HeaderSortCell = (props: HeaderSortProps) => {
  const { headCell, createSortHandler } = props;

  const {
    sort: { order, orderBy },
  } = useContext(FileTableContext) as FileTableContextProps;

  return (
    <TableSortLabel
      active={orderBy === headCell.id}
      direction={orderBy === headCell.id ? order : "asc"}
      onClick={createSortHandler(headCell.id)}
    >
      {headCell.label}
      {orderBy === headCell.id ? (
        <Box component="span" sx={visuallyHidden}>
          {order === "desc" ? "sorted descending" : "sorted ascending"}
        </Box>
      ) : null}
    </TableSortLabel>
  );
};

export default function TableHead() {
  const {
    headCells,
    sort: { order, orderBy, handleRequestSort },
  } = useContext(FileTableContext) as FileTableContextProps;

  const createSortHandler: SortHandlerFunction = (property) => (event) => {
    handleRequestSort(event, property);
  };

  return (
    <MuiTableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ color: "white", background: "black", fontWeight: "bold" }}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <HeaderSortCell
                headCell={headCell}
                createSortHandler={createSortHandler}
              />
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
}
