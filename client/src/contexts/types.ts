export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  firstName?: string;
  login: (username: string, password: string) => Promise<string | undefined>;
  loginMobile: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ScreenSizeContextProps {
  mobile: boolean;
  handleNotMobile: () => void;
}
