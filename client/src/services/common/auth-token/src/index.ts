export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (authToken: string) => {
  localStorage.setItem("authToken", authToken);
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
