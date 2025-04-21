import { useAuth } from "@/contexts/useAuth";
import AppRouter from "./router";
import { AxiosProvider } from "@/lib/axios/AxiosProvider";

function App() {
  const { accessToken, logout } = useAuth();

  /**
   * <AxiosProvider token={accessToken} logout={logout}>
      <AppRouter />
    </AxiosProvider>
   */
  return (
    <AppRouter />
  );
}

export default App;
