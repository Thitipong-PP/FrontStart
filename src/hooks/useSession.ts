/**
 * NextAuth-compatible session hooks for this Vite/React app.
 *
 * API mirrors NextAuth v5:
 *   const { data: session, status } = useSession();
 *   const signIn = useSignIn();   → await signIn({ email, password })
 *   const signOut = useSignOut(); → signOut()
 */

import { useAppDispatch, useAppSelector } from '../store';
import {
  signInCredentials,
  signOut as signOutAction,
  selectUser,
  selectAuthStatus,
  selectAuthError,
  selectIsAdmin,
} from '../store/slices/authSlice';

// ── useSession ────────────────────────────────────────────────────────────────
// Mirrors NextAuth's useSession() → { data, status }
export function useSession() {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectAuthStatus);

  return {
    data: user ? { user } : null,
    status,
  };
}

// ── useSignIn ─────────────────────────────────────────────────────────────────
// Returns an async signIn function (mirrors NextAuth signIn)
export function useSignIn() {
  const dispatch = useAppDispatch();
  return async (credentials: { email: string; password: string }) => {
    const result = await dispatch(signInCredentials(credentials));
    if (signInCredentials.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
    return result.payload;
  };
}

// ── useSignOut ────────────────────────────────────────────────────────────────
// Returns a signOut function (mirrors NextAuth signOut)
export function useSignOut() {
  const dispatch = useAppDispatch();
  return () => dispatch(signOutAction());
}

// ── useAuthUser ───────────────────────────────────────────────────────────────
// Convenience hook — returns the current user and helper booleans
export function useAuthUser() {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectAuthStatus);
  const isAdmin = useAppSelector(selectIsAdmin);
  const error = useAppSelector(selectAuthError);

  return {
    user,
    isAuthenticated: status === 'authenticated',
    isAdmin,
    status,
    error,
  };
}
