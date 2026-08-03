import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-compatible middleware using only the auth config (no Node.js deps)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
