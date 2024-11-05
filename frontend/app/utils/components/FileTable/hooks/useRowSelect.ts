import {
  ChangeEvent,
  SingleRowClickEvent,
} from "@/app/utils/interface/file-listing.model";
import { useState } from "react";

export interface UserRowSelectProps<T> {
  rows: T[];
}

export default function useRowSelect<T>(props: UserRowSelectProps<T>) {
  const { rows } = props;
  const [selected, setSelected] = useState<T[]>([]);

  const handleSelectAllClick: ChangeEvent = (event) => {
    if (event.target.checked) {
      setSelected(rows);
      return;
    }
    setSelected([]);
  };

  const handleClick: SingleRowClickEvent<T> = (_, row) => {
    const selectedIndex = selected.findIndex((r) => r === row);
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const resetSelection = () => {
    setSelected([]);
  };

  return { selected, handleSelectAllClick, handleClick, resetSelection };
}
