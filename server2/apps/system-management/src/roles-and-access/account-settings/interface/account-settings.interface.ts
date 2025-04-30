export interface AccountSettings {
  updateAccountSettings: {
    username: string;
    email: string;
    password: string | null;
  };
}
