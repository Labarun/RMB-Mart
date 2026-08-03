import NextAuth from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "CUSTOMER" | "ADMIN";
    };
  }

  interface User {
    role: "CUSTOMER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CUSTOMER" | "ADMIN";
  }
}
