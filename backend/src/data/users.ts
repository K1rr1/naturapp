export type MockUser = {
  id: string;
  username: string;
  password: string;
  name: string;
};

export const users: MockUser[] = [
  {
    id: "user-456",
    username: "user-456",
    password: "mypassword123",
    name: "Testanvändare",
  },
];