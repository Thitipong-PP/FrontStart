import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "../validateCredentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
        userData: { label: "User Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // First try admin validation
        const adminUser = validateCredentials(
          credentials.email,
          credentials.password,
        );

        if (adminUser) {
          return adminUser;
        }

        // For regular users from localStorage, use passed userData
        if (credentials.userData) {
          try {
            const user = JSON.parse(credentials.userData);
            // Verify email and password match to prevent tampering
            if (
              user.email === credentials.email &&
              user.password === credentials.password
            ) {
              return user;
            }
          } catch (error) {
            console.error("Error parsing userData:", error);
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.telephone = user.telephone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role as "user" | "admin";
        session.user.telephone = token.telephone;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "dentist-booking-secret-dev-key-change-in-production",
};
