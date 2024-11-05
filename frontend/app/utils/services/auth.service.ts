import { AxiosError } from "axios";
import { showSnackbar } from "../components/SnackbarProvider";
import {
  APIResponse,
  AxiosResponse,
  SnackbarType,
} from "../interface/shared.model";
import {
  UserAuthModel,
  UserLoginModel,
  UserSignupModel,
} from "../interface/user.model";
import { axios, handleAxiosError } from "./axios";

const TOKEN_KEY = "user-local-storage";
export function setUserToken(details: UserAuthModel) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(details));
}

export function getUserToken(): UserAuthModel | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(TOKEN_KEY);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

export function logoutUser(): UserAuthModel | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(TOKEN_KEY);
  if (!data) {
    return null;
  }
  const authModel: UserAuthModel = JSON.parse(data);
  authModel.isActive = false;
  setUserToken(authModel);
  return authModel;
}

export async function userLogin(
  payload: UserLoginModel
): Promise<APIResponse<UserAuthModel>> {
  const apiResponse: APIResponse<UserAuthModel> = {
    success: false,
  };

  try {
    const res = await axios.post<AxiosResponse<UserAuthModel>>(
      "/auth/login",
      payload
    );
    if (res.data.message) {
      showSnackbar({
        message: res.data.message,
        severity: SnackbarType.SUCCESS,
        id: "login-status",
      });
    }
    const userModel = res.data.data as UserAuthModel;
    userModel.isActive = true;
    setUserToken(userModel);
    apiResponse.data = userModel;
    apiResponse.success = true;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }

  return apiResponse;
}

export async function userSignup(
  payload: UserSignupModel
): Promise<APIResponse<UserAuthModel>> {
  const apiResponse: APIResponse<UserAuthModel> = {
    success: false,
  };

  try {
    const res = await axios.post<AxiosResponse<UserAuthModel>>(
      "/auth/signup",
      payload
    );
    if (res.data.message) {
      showSnackbar({
        message: res.data.message,
        severity: SnackbarType.SUCCESS,
        id: "signup-status",
      });
    }
    const userModel = res.data.data as UserAuthModel;
    userModel.isActive = true;
    setUserToken(userModel);
    apiResponse.data = userModel;
    apiResponse.success = true;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }

  return apiResponse;
}

export async function isAlive() {}
