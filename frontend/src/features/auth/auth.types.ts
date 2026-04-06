export type UserMode = "guest" | "user";

export type User = {
  id: string;
  username: string;
  name: string;
  mode: UserMode;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterData = {
  
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};