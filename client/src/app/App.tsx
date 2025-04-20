import { useAuth } from "@/contexts/useAuth";
import AppRouter from "./router";
import { AxiosProvider } from "@/lib/axios/AxiosProvider";

function App() {
  const { accessToken, logout } = useAuth();
  return (
    <AxiosProvider token={accessToken} logout={logout}>
      <AppRouter />
    </AxiosProvider>
  );
}

export default App;
