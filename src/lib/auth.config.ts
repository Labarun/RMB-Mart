import type { NextAuthConfig } from "next-auth";

// This config is Edge-compatible (no Node.js-only imports)
// Used by middleware for route protection
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers added in the full auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string })?.role;
      const pathname = nextUrl.pathname;

      // Protected customer routes
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/orders")) {
        if (!isLoggedIn) return false; // Redirects to signIn page
        return true;
      }

      // Protected admin routes
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Redirect logged-in users away from auth pages
      if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
          if (userRole === "ADMIN") {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};
