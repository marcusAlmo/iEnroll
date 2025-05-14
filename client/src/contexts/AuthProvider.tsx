import { login } from "@/services/mobile-web-app/auth";
import { ReactNode, useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkIsAuthenticated } from "@/services/common/auth";
import { logout as logoutAccount } from "@/services/common/auth";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Pa-change na lang ulit to false
  // const initialAuthToken = useRef(getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const {
    data: loginData,
    isPending: isLoginPending,
    error: loginError,
  } = useQuery({
    queryKey: ["get-is-authenticated"],
    queryFn: checkIsAuthenticated,
  });

  const { mutate: mutateLogout } = useMutation({
    mutationKey: ["logout-account"],
    mutationFn: logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false);
    },
    onError: () => {
      toast.error("Error logging out account.");
    },
  });

  useEffect(() => {
    if (!isLoginPending && loginData) setIsAuthenticated(true);
  }, [isLoginPending, loginData]);

  useEffect(() => {
    if (loginError) setIsAuthenticated(false);
  }, [loginError]);

  // First name of the student
  // Kindly modify default value during backend integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [firstName, setFirstName] = useState<string>("Juan");

  // // Check if auth token is present in local storage to determine if user is authenticated
  // useEffect(() => {
  //   setIsAuthenticated(!!localStorage.getItem('authToken'));
  // }, []);
  const register = useCallback(() => {
    // setAuthToken(token);
    // setAccessToken(token);
    setIsAuthenticated(true);
  }, []);

  const forget = useCallback(() => {
    mutateLogout();
  }, [mutateLogout]);

  const loginWeb = async (
    username: string,
    password: string,
  ): Promise<string | undefined> => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/login/attempt_login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Login failed: " + response.statusText);
      }

      const data = await response.json();

      // // Assuming success message or account type is returned on success
      // if (data?.authToken) {
      //   register(data.authToken);
      //   return data.account_type || "User"; // Return account type on successful login
      // }

      return data?.message || "An error occurred";
    } catch (error) {
      console.error("Error during login:", error);
      return "An error occurred during login";
    }
  };

  const loginMobile = async (username: string, password: string) => {
    await login({
      username,
      password,
    });
    register();
  };

  const logout = () => {
    forget();
  };

  // // Automatically authenticate for development/testing purposes
  // useEffect(() => {
  //   if (!isAuthenticated && import.meta.env.DEV) {
  //     const dummyToken = "dev-auth-token";
  //     register(dummyToken);
  //   }
  // }, [isAuthenticated, register]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        firstName,
        login: loginWeb,
        loginMobile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
