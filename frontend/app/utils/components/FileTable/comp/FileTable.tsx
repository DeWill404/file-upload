import {
  DeleteColumnsHeaderIds,
  FileTableColumns,
  FileTableContextProps,
  FileTableProps,
  HeaderLabels,
  SortOrder,
} from "@/app/utils/interface/file-listing.model";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSort from "../hooks/useSort";
import useRowSelect from "../hooks/useRowSelect";
import usePagination from "../hooks/usePagination";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import EmptyRows from "./EmptyRows";
import {
  FileAccessModel,
  FileListingModel,
  FileUploadModel,
} from "@/app/utils/interface/file.model";
import { getAllFiles } from "@/app/utils/services/file.service";
import { TusUploadContext } from "../../Uploader/useTusClient";

const mapRows = (
  rowData: FileListingModel[],
  uploadData: FileUploadModel[]
): FileTableColumns[] =>
  rowData.map((data) => ({
    id: data.id,
    name: data.name,
    size: data.size,
    owner: data.owner_name,
    upload_date: new Date(data.created_on).toDateString(),
    access: data.access as FileAccessModel,
    upload_status: uploadData.find((u) => u.file_id === data.id) || null,
    delete_date: new Date(data.updated_on).toDateString(),
    action: null,
  }));

export const FileTableContext = createContext<FileTableContextProps | null>(
  null
);

export default function FileTable({
  allData,
  setAllData,
  reloadState,
}: FileTableProps) {
  const [rows, setRows] = useState<FileTableColumns[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const isFirstLoad = useRef(true);
  const isAPICallinprogress = useRef(false);
  const setUploadData = useContext(TusUploadContext)[1];

  const headCells = HeaderLabels.filter((cell) =>
    DeleteColumnsHeaderIds.includes(cell.id)
  );
  const sort = useSort<keyof FileTableColumns>({
    defaultOrder: SortOrder.ASC,
    defaultOrderBy: "name",
  });
  const select = useRowSelect<number>({
    rows: rows.map((n) => n.id),
  });
  const page = usePagination();

  const { page: pageIndex, rowsPerPage } = useMemo(() => page, [page]);

  useEffect(() => {
    const fetchFiles = async () => {
      isAPICallinprogress.current = true;
      setIsLoading(true);
      const res = await getAllFiles(
        pageIndex,
        rowsPerPage,
        isFirstLoad.current
      );
      setIsLoading(false);
      isAPICallinprogress.current = false;
      if (res.success && res.data) {
        const _rowData = res.data.data;
        const _uploadData = res.data.uploadData;
        const _rowCount = res.data.count;
        setRowCount(_rowCount);
        if (isFirstLoad.current) {
          setAllData(mapRows(_rowData, _uploadData));
          setRows(mapRows(_rowData.slice(0, rowsPerPage), _uploadData));
          isFirstLoad.current = false;
          setUploadData(_uploadData);
        } else {
          setRows(mapRows(_rowData, _uploadData));
        }
      }
    };
    if (!isAPICallinprogress.current) {
      fetchFiles();
    }
  }, [reloadState, pageIndex, rowsPerPage, setAllData, setUploadData]);

  return (
    <FileTableContext.Provider
      value={{ sort, select, page, rows, headCells, allData }}
    >
      <Box width={1}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead />
              <TableBody>
                {!isLoading &&
                  rows.map((row, index) => (
                    <TableRow key={index} row={row} index={index} />
                  ))}
                <EmptyRows isLoading={isLoading} />
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rowCount}
            rowsPerPage={page.rowsPerPage}
            page={page.page}
            onPageChange={page.handleChangePage}
            onRowsPerPageChange={page.handleChangeRowsPerPage}
            disabled={isLoading}
          />
        </Paper>
      </Box>
    </FileTableContext.Provider>
  );
}
