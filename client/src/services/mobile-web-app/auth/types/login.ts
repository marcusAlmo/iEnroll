export interface LoginBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}
