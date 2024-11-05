import { ChangeEvent } from "@/app/utils/interface/file-listing.model";
import { useState } from "react";

export default function usePagination() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const resetPage = () => {
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage: ChangeEvent = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    resetPage();
  };

  return {
    page,
    rowsPerPage,
    resetPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
}
