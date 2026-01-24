import React from "react";
import { hasPermission } from "@/utils/permissionUtils";
import { Permission } from "@/types/auth.types";

const CanAccess = ({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) => {
  if (!hasPermission(permission)) return null;
  return <>{children}</>;
};

export default CanAccess;
