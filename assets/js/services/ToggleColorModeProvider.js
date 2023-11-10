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

    const lightTheme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#2196f3',
        },
        secondary: {
          main: '#F7C73D', 
        },
        background: {
          default: '#f5f5f5', 
        },
      },
    });
  
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
        secondary: {
          main: '#2145BF', 
        },
      },
    });
  
    const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode,
            primary: {
              main: '#2196f3', 
            },
            secondary: {
              main: '#f50057', 
            },
          },
          ...(mode === 'dark' ? darkTheme : lightTheme),
        }),
      [mode, darkTheme, lightTheme]
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