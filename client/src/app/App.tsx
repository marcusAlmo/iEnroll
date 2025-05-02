import { ToastContainer } from "react-toastify";
import AppRouter from "./router";
import { AxiosProvider } from "@/lib/axios/AxiosProvider";

function App() {
  const { accessToken, logout } = useAuth();

  return (
    <>
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
    </>
  );
}

export default App;
