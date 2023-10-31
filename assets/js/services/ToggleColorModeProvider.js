import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ColorModeContext from './ColorModeContext';

function ToggleColorModeProvider({ children }) {
  const storedMode = localStorage.getItem('colorMode');
  const [mode, setMode] = React.useState(storedMode || 'light');
  
    const colorMode = React.useMemo(
      () => ({
        mode,
        toggleColorMode : () => {
          const newMode = mode === 'light' ? 'dark' : 'light';
          setMode(newMode);
          localStorage.setItem('colorMode', newMode); 
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