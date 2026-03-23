"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "@/components/Toaster";
import { store } from "@/store";
import { loadReviews } from "@/store/slices/reviewSlice";
import { loadBookings } from "@/store/slices/bookingSlice";
import muiTheme from "@/theme/muiTheme";

// Bootstrap component — initialises Redux state from localStorage on mount
function AppBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    // NextAuth handles authentication state, Redux only manages bookings & reviews
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
