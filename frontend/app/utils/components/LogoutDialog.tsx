import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { logoutUser } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./SnackbarProvider";
import { UserAuthModel } from "../interface/user.model";

export default function LogoutDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const setAuthModel = useContext(UserContext)[1];
  const router = useRouter();

  const onConfirmation = () => {
    const authModel = logoutUser();
    setAuthModel(authModel as UserAuthModel);
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>Are you sure want to log out?</DialogContent>
      <DialogActions>
        <Button color="inherit" autoFocus onClick={onClose}>
          No
        </Button>
        <Button color="inherit" onClick={onConfirmation}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
