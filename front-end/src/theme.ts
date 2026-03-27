import { createTheme } from "@mui/material/styles";

const wikipediaHeadingFont = '"Linux Libertine", Georgia, Times, serif';
const bodyFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                a: {
                    color: "#3366cc",
                    textDecoration: "none",
                    "&:visited": {
                        color: "#6e4b7b",
                    },
                    "&:hover": {
                        textDecoration: "underline",
                    },
                },
            },
        },
    },
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
