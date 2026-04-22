export type MockUser = {
  id: string;
  username: string;
  passwordHash: string;
};

export const defaultUsers: MockUser[] = [
  {
    id: "user-456",
    // Demo user for local development.
    username: "user-456",
    // Password: mypassword123
    passwordHash: "$2b$10$wZ7F1PoB7pJD2RVGQG/jyuBYK3Odphy9fkiGqVsB/.2GIJ3wpQ9pK",
  },
];