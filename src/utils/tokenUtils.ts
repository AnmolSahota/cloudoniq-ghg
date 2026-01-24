import Cookies from "js-cookie";
import { DecodedToken, Permission } from "@/types/auth.types";

export const setToken = (token: string) => {
  Cookies.set("auth_token", token, { sameSite: "strict" });
};

export const getToken = () => Cookies.get("auth_token");

export const removeToken = () => Cookies.remove("auth_token");

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const extractPermissions = (
  decoded: DecodedToken
): Permission[] => {
  return decoded.permissions || [];
};
