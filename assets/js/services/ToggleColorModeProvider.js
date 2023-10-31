import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ColorModeContext from './ColorModeContext';

function ToggleColorModeProvider({ children }) {
    const [mode, setMode] = React.useState('light');
  
    const colorMode = React.useMemo(
      () => ({
        mode, // Incluez le mode actuel dans le contexte
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
      }),
      [mode]
    );
  
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  
    const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode,
          },
          ...(mode === 'dark' ? darkTheme : {}),
        }),
      [mode, darkTheme]
    );
  
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }
  
  export default ToggleColorModeProvider;