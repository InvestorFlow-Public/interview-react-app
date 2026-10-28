import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ApiError } from './api/httpClient';

const theme = createTheme();

// Opt into React Router v7 behaviour now to ease a future upgrade.
export const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // Don't retry auth/not-found failures; they won't succeed on retry.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && [401, 403, 404].includes(error.status)) &&
          failureCount < 2,
      },
    },
  });
}

const defaultQueryClient = createQueryClient();

interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  /** Set to false when the caller supplies its own router (e.g. MemoryRouter in tests). */
  router?: boolean;
}

export default function AppProviders({
  children,
  queryClient = defaultQueryClient,
  router = true,
}: Readonly<AppProvidersProps>) {
  const content = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return router ? <BrowserRouter future={routerFuture}>{content}</BrowserRouter> : content;
}
