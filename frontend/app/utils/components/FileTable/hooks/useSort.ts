import {
  SortEventFunction,
  SortOrder,
} from "@/app/utils/interface/file-listing.model";
import { useState } from "react";

export interface SortProps<T> {
  defaultOrder: SortOrder;
  defaultOrderBy: T;
}

export default function useSort<T>(props: SortProps<T>) {
  const [order, setOrder] = useState<SortOrder>(props.defaultOrder);
  const [orderBy, setOrderBy] = useState<T>(props.defaultOrderBy);

  const handleRequestSort: SortEventFunction<T> = (_, property) => {
    const isAsc = orderBy === property && order === SortOrder.ASC;
    setOrder(isAsc ? SortOrder.DESC : SortOrder.ASC);
    setOrderBy(property);
  };

  const resetSorting = () => {
    setOrder(props.defaultOrder);
    setOrderBy(props.defaultOrderBy);
  };

  return { order, orderBy, handleRequestSort, resetSorting };
}
