import { Box } from "@mui/material";

export default function Root() {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100dvh"}
    >
      <div className="loader"></div>
    </Box>
  );
}
