"use client";

import * as React from "react";
import { FileUploadModel } from "../utils/interface/file.model";
import FileTable from "../utils/components/FileTable/comp/FileTable";
import Navabar from "../utils/components/Navbar";
import Uploader from "../utils/components/Uploader";
import { TusUploadContext } from "../utils/components/Uploader/useTusClient";
import { Box } from "@mui/material";
import { FileTableColumns } from "../utils/interface/file-listing.model";
import useReload from "../utils/components/FileTable/hooks/useReload";

export default function Home() {
  const [fileUploadList, updateFileUploadList] = React.useState<
    FileUploadModel[]
  >([]);
  const [allData, setAllData] = React.useState<FileTableColumns[]>([]);
  const { reloadState, reload } = useReload();

  return (
    <main>
      <TusUploadContext.Provider value={[fileUploadList, updateFileUploadList]}>
        <Navabar />
        <FileTable
          allData={allData}
          setAllData={setAllData}
          reloadState={reloadState}
          reload={reload}
        />
        <Uploader allData={allData} reload={reload} />
        <Box mb={12}></Box>
      </TusUploadContext.Provider>
    </main>
  );
}
