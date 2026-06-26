import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

export const ThemeProviderContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#c44eff',
        },
      },
      typography: {
        fontFamily: 'Rubik, sans-serif',
      },
    });
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
