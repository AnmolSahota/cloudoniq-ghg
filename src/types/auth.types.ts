export type Permission = "read" | "write";

export interface User {
  id: string;
  email: string;
  name: string;
  userId: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  userId: string;
  permissions: Permission[];
  exp: number;
}
