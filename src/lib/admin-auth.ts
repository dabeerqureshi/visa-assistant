// Hardcoded admin credentials - secure for MVP
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function authenticateAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return decoded.role === "admin" && decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function createAdminToken(): string {
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  // Simple base64 encoding for MVP (not cryptographic)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa("admin-secret-" + body);
  return `${header}.${body}.${signature}`;
}