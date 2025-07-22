import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  exp: number;  // expiration time in seconds since epoch
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;
    // exp is in seconds, Date.now() is milliseconds
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
