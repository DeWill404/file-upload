"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { getFileServerUrl } from "@/app/utils/read-env";
import { useParams, useSearchParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Navabar from "@/app/utils/components/Navbar";
import Link from "next/link";
import { Download } from "@mui/icons-material";

export default function FilePreview() {
  const [data, setData] = useState<unknown[]>([]);
  const { id } = useParams();
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        let response;
        try {
          setLoading(true);
          response = await fetch(`${getFileServerUrl()}/${id}`);
          setLoading(false);
        } catch (error) {
          console.error(error);
          return;
        }
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data);
          },
        });
      };
      fetchData();
    }
  }, [id]);

  const DataTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {Object.keys(data[0] as object).map((key, idx) => (
              <TableCell
                key={idx}
                sx={{
                  "&:not(:last-child)": {
                    borderRight: 1,
                    borderColor: "hsl(215, 15%, 82%)",
                  },
                }}
              >
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: unknown, index: number) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { borderBottom: 0 } }}
            >
              {Object.values(row as object).map((value: string, i: number) => (
                <TableCell
                  key={i}
                  sx={{
                    "&:not(:last-child)": {
                      borderRight: 1,
                      borderColor: (theme) => theme.palette.grey[300],
                    },
                  }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <main>
      <Navabar />
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Typography variant="h5">{params.get("fileName") || "---"}</Typography>
        <Box
          component={Link}
          href={`${getFileServerUrl()}/${id}`}
          target="_blank"
          display="flex"
          alignItems="center"
        >
          <Download />
        </Box>
      </Box>
      {loading || !data.length ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={28} color="inherit" />
          <Typography variant="h6">Loading...</Typography>
        </Box>
      ) : (
        <DataTable />
      )}
    </main>
  );
}
