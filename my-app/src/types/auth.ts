// Mirrors SignupUser / LoginUser in the API.
export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
}
