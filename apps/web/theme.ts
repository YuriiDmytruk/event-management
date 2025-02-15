// theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;