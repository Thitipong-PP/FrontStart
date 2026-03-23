/**
 * Shared user validation logic for authentication
 * Used by both NextAuth CredentialsProvider and validation API route
 */

export interface ValidatedUser {
  id: string;
  email: string;
  name: string;
  telephone?: string;
  role: "user" | "admin";
}

/**
 * Validate user credentials against stored users
 * Supports:
 * - Admin account (built-in)
 * - Regular users (from localStorage, needs to be called from client context)
 *
 * In production, this should query your database instead
 */
export function validateCredentials(
  email: string,
  password: string,
): ValidatedUser | null {
  // Admin account
  if (email === "admin@dentist.com" && password === "admin123") {
    return {
      id: "admin",
      email: "admin@dentist.com",
      name: "Admin",
      telephone: undefined,
      role: "admin",
    };
  }

  // For regular users stored in client-side localStorage:
  // Since this runs on the server, we can't access client localStorage directly
  // Regular users are validated during the NextAuth sign-in flow on the client
  // In production, query your database here

  return null;
}

/**
 * Validate user from localStorage (client-side only)
 * This is used during registration and login on the client
 */
export function validateUserFromStorage(
  email: string,
  password: string,
): ValidatedUser | null {
  try {
    // Check admin
    if (email === "admin@dentist.com" && password === "admin123") {
      return {
        id: "admin",
        email: "admin@dentist.com",
        name: "Admin",
        role: "admin",
      };
    }

    // Check registered users in localStorage
    if (typeof localStorage !== "undefined") {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          telephone: user.telephone,
          role: user.role || "user",
        };
      }
    }
  } catch (error) {
    console.error("Error validating user from storage:", error);
  }

  return null;
}
