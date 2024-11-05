import instance, { AxiosError } from "axios";
import { showSnackbar } from "../components/SnackbarProvider";
import { SnackbarType } from "../interface/shared.model";
import { getBackednUrl } from "../read-env";
import { getUserToken } from "./auth.service";

export const axios = instance.create({ baseURL: getBackednUrl() });

axios.interceptors.request.use((config) => {
  const userToken = getUserToken();
  if (userToken && userToken.token) {
    config.headers["Authorization"] = `Bearer ${userToken.token}`;
  }
  return config;
});

export function handleAxiosError(axiosError: AxiosError) {
  const errorResponse = axiosError.response?.data as {
    [key: string]: string;
  } | null;
  if (errorResponse?.detail) {
    showSnackbar({
      message: errorResponse?.detail,
      severity: SnackbarType.ERROR,
      id: "api-error",
    });
  } else {
    showSnackbar({
      message: "An error occured!",
      severity: SnackbarType.ERROR,
      id: "api-error",
    });
  }
}

export function handleAuthenticationError(axiosError: AxiosError) {
  if (
    axiosError.response?.status === 401 ||
    axiosError.response?.status === 403
  ) {
    const pathname = window.location.pathname;
    if (pathname !== "/login" && pathname !== "/signup") {
      setTimeout(() => (window.location.href = "/login"), 1000);
    }
  }
}
