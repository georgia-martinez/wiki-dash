import { createTheme } from "@mui/material/styles";

const wikipediaHeadingFont = '"Linux Libertine", Georgia, Times, serif';
const bodyFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
    typography: {
        h1: {
            fontFamily: wikipediaHeadingFont,
        },
        h2: {
            fontFamily: wikipediaHeadingFont,
        },
        h3: {
            fontFamily: wikipediaHeadingFont,
        },
        h4: {
            fontFamily: wikipediaHeadingFont,
        },
        h5: {
            fontFamily: wikipediaHeadingFont,
        },
        body1: {
            fontFamily: bodyFont,
        },
        body2: {
            fontFamily: bodyFont,
        },
    },
});
