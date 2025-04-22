import { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { AxiosError, HttpStatusCode } from "axios";
import { instance } from ".";
import { AlertTriangle } from "lucide-react";

type Props = {
  token: string | null;
  logout: () => void;
  children: ReactNode;
};

const CHECK_STATUS = !import.meta.env.DEV;

export const AxiosProvider = ({ token, logout, children }: Props) => {
  const interceptorsRegistered = useRef(false);
  const checking = useRef(false);
  const [ready, setReady] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = useCallback(async (manual = false) => {
    if (checking.current) return;
    checking.current = true;
    if (manual) setIsChecking(true);

    try {
      await instance.get("/api/health", { timeout: 5000 });
      setServerDown(false);
    } catch {
      if (manual) setServerDown(true);
    } finally {
      checking.current = false;
      if (manual) setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!serverDown) return;
    const interval = setInterval(() => checkServerStatus(), 5000);
    return () => clearInterval(interval);
  }, [serverDown, checkServerStatus]);

  useEffect(() => {
    if (interceptorsRegistered.current) return;

    const reqInterceptor = instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const resInterceptor = instance.interceptors.response.use(
      (res) => {
        setServerDown(false);
        return res;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status === HttpStatusCode.InternalServerError) setServerDown(true);
        if (status === HttpStatusCode.Unauthorized) logout();
        return Promise.reject(error);
      },
    );

    interceptorsRegistered.current = true;
    setReady(true);

    return () => {
      instance.interceptors.request.eject(reqInterceptor);
      instance.interceptors.response.eject(resInterceptor);
      interceptorsRegistered.current = false;
    };
  }, [token, logout]);

  useEffect(() => {
    if (CHECK_STATUS && ready) checkServerStatus(true);
  }, [ready, checkServerStatus]);

  if (!ready) return null;

  if (CHECK_STATUS && serverDown) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <p className="mb-6 text-xl font-semibold text-gray-800">
            Cannot connect to server. Please check your connection or try again.
          </p>
          <button
            onClick={() => checkServerStatus(true)}
            disabled={isChecking}
            className={`inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium text-white transition duration-300 ${
              isChecking
                ? "cursor-not-allowed bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isChecking ? "Checking..." : "Retry Now"}
          </button>
          <p className="mt-6 text-sm text-gray-600">
            If the issue persists, please contact support or check your network
            settings.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
