import { useState } from "react";

export default function useReload() {
  const [reloadState, setRoloadState] = useState<number>(1);

  const reload = () => {
    setRoloadState((prev) => (prev % 100 ? prev + 1 : 1));
  };

  return { reloadState, reload };
}
