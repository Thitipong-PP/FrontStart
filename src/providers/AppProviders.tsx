"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/store";
import { initAuth } from "@/store/slices/authSlice";
import { loadReviews } from "@/store/slices/reviewSlice";
import { loadBookings } from "@/store/slices/bookingSlice";
import muiTheme from "@/theme/muiTheme";

// Suppress Figma-inspector data-fg* prop warnings that are injected by the
// Figma Make preview environment and cannot be removed from our code.
if (typeof window !== "undefined") {
  const _origConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (args.some((a) => typeof a === "string" && /data-fg/i.test(a))) return;
    _origConsoleError(...args);
  };
}

// Bootstrap component — initialises Redux state from localStorage on mount
function AppBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(initAuth() as any);
    store.dispatch(loadReviews() as any);
    store.dispatch(loadBookings() as any);
  }, []);

  return <>{children}</>;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        <AppBootstrap>
          {children}
          <Toaster />
        </AppBootstrap>
      </ThemeProvider>
    </Provider>
  );
}
