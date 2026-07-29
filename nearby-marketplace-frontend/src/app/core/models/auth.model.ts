export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  cityId: number;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;   // email
  iat: number;
  exp: number;
}
