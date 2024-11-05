export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export type UserSignupModel = Pick<UserModel, "name" | "email" | "password">;

export type UserLoginModel = Pick<UserModel, "email" | "password">;

export interface UserAuthModel {
  name: string;
  token: string;
  isActive?: boolean;
}
