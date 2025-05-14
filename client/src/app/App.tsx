import { ToastContainer } from "react-toastify";
import AppRouter from "./router";
import { AxiosProvider } from "@/lib/axios/AxiosProvider";
import { useAuth } from "@/contexts/useAuth";

function App() {
  const { logout } = useAuth();

  return (
    <AxiosProvider logout={logout}>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AxiosProvider>
  );
}

export default App;
