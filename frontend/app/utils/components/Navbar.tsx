import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "./SnackbarProvider";
import { Logout } from "@mui/icons-material";
import LogoutDialog from "./LogoutDialog";
import { getUserToken } from "../services/auth.service";

export default function Navabar() {
  const authModel = useContext(UserContext)[0];
  const userName = useMemo(() => {
    let _authModel = authModel;
    if (!_authModel || !_authModel.isActive) {
      _authModel = getUserToken();
    }
    if (!_authModel || !_authModel.isActive) {
      return null;
    }

    if (_authModel.name.length > 10) {
      return _authModel.name.slice(0, 10) + "...";
    }
    return _authModel.name;
  }, [authModel]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <AppBar color="default">
        <Toolbar component={Container}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Uploader
          </Typography>
          {userName ? (
            <Button
              color="inherit"
              variant="outlined"
              endIcon={<Logout />}
              onClick={openDialog}
            >
              {userName}
            </Button>
          ) : (
            <Button color="inherit" variant="outlined" href="/login">
              Login
            </Button>
          )}
        </Toolbar>
        <LogoutDialog isOpen={isDialogOpen} onClose={closeDialog} />
      </AppBar>
      <Box
        sx={(theme) => ({
          height: (theme.mixins.toolbar.minHeight as number) + 32,
        })}
      ></Box>
    </>
  );
}
