"use client";

import { Bounce, toast, ToastContainer } from "react-toastify";
import { SnackbarDetails } from "../interface/shared.model";
import { Alert, Container } from "@mui/material";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { UserAuthModel } from "../interface/user.model";
import { usePathname, useRouter } from "next/navigation";
import { getUserToken } from "../services/auth.service";

export const showSnackbar = (snackbar: SnackbarDetails) => {
  toast(
    () => (
      <Alert
        sx={{ minHeight: 64, alignItems: "center" }}
        severity={snackbar.severity}
      >
        {snackbar.message}
      </Alert>
    ),
    { toastId: snackbar.id }
  );
};

export const UserContext = createContext<
  [UserAuthModel | null, Dispatch<SetStateAction<UserAuthModel>>]
>([null, () => {}]);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [authModel, setAuthModel] = useState<UserAuthModel>({
    token: "",
    name: "",
    isActive: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authModel) {
      const userToken = getUserToken();
      if (userToken) {
        setAuthModel(userToken);
      }
    }
  }, [authModel]);

  useEffect(() => {
    const isUserActiveInCache = !!getUserToken()?.isActive;
    const isSessionValid = isUserActiveInCache;

    if (isSessionValid && pathname === "/") {
      router.push("/home");
    } else if (!isSessionValid && !["/login", "/signup"].includes(pathname)) {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <>
      <UserContext.Provider value={[authModel, setAuthModel]}>
        <Container>{children}</Container>
      </UserContext.Provider>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};
