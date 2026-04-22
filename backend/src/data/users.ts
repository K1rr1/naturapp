import bcrypt from "bcryptjs";

export type MockUser = {
  id: string;
  username: string;
  passwordHash: string;
};

export const users: MockUser[] = [
  {
    id: "user-456",
    username: "user-456",
    // Demo user for local development.
    passwordHash: bcrypt.hashSync("mypassword123", 10),
  },
];