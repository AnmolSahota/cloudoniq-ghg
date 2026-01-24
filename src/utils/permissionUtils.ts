import { store } from "@/redux/store";
import { Permission } from "@/types/auth.types";

export const hasPermission = (perm: Permission) => {
  const { permissions } = store.getState().auth;
  return permissions.includes(perm);
};

export const canRead = () => hasPermission("read");
export const canWrite = () => hasPermission("write");

export const isViewOnly = () =>
  canRead() && !canWrite();
