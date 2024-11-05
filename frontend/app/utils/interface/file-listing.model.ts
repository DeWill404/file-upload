import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { FileAccessModel, FileUploadModel } from "./file.model";

export enum FileTableView {
  STANDARD,
  UPLOAD,
  DELETED,
}

export interface FileTableColumns {
  id: number;
  name: string;
  size: number;
  owner: string;
  upload_date: string;
  access: FileAccessModel;
  upload_status: FileUploadModel | null;
  delete_date: string;
  action: null;
}

export const FileTableHeaderIds: (keyof FileTableColumns)[] = [
  "name",
  "size",
  "owner",
  "upload_date",
  "access",
  "upload_status",
  "delete_date",
  "action",
];

export const StandardColumnsHeaderIds = FileTableHeaderIds.filter(
  (c) => !["upload_status", "delete_date"].includes(c)
);

export const UploadColumnsHeaderIds = FileTableHeaderIds.filter(
  (c) => !["access", "delete_date"].includes(c)
);

export const DeleteColumnsHeaderIds = FileTableHeaderIds.filter(
  (c) => !["access", "upload_status"].includes(c)
);

export interface HeadCell {
  id: keyof FileTableColumns;
  label: string;
  sortable: boolean;
}

export const HeaderLabels: readonly HeadCell[] = [
  { id: "name", label: "Name", sortable: false },
  { id: "size", label: "File Size", sortable: false },
  { id: "owner", label: "Owner", sortable: false },
  { id: "upload_date", label: "Uploaded On", sortable: false },
  { id: "access", label: "File Access", sortable: false },
  { id: "upload_status", label: "Upload Status", sortable: false },
  { id: "delete_date", label: "Deleted On", sortable: false },
  { id: "action", label: "", sortable: false },
];

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface HeaderSortProps {
  headCell: HeadCell;
  createSortHandler: SortHandlerFunction;
}

export interface RowProps {
  row: FileTableColumns;
  index: number;
}

export interface FileTableProps {
  allData: FileTableColumns[];
  setAllData: Dispatch<SetStateAction<FileTableColumns[]>>;
  reloadState: number;
  reload: () => void;
}

export interface FileTableContextProps {
  headCells: HeadCell[];
  allData: FileTableColumns[];
  rows: FileTableColumns[];
  sort: {
    order: SortOrder;
    orderBy: keyof FileTableColumns;
    handleRequestSort: SortEventFunction<keyof FileTableColumns>;
  };
  select: {
    selected: number[];
    handleClick: SingleRowClickEvent<number>;
    handleSelectAllClick: ChangeEvent;
  };
  page: {
    page: number;
    rowsPerPage: number;
    handleChangePage: PageChangeEvent<number>;
    handleChangeRowsPerPage: ChangeEvent;
  };
}

export type SortHandlerFunction = (
  property: keyof FileTableColumns
) => MouseEventHandler<HTMLSpanElement> | undefined;

export type SortEventFunction<T> = (
  event: React.MouseEvent<unknown>,
  property: T
) => void;

export type SingleRowClickEvent<T> = (
  event: React.MouseEvent<unknown>,
  row: T
) => void;

export type PageChangeEvent<T> = (event: unknown, newPage: T) => void;

export type ChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => void;
