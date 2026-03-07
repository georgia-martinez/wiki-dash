/**
 * Prettier config for wiki-dash (Vite + React + TypeScript).
 * @type {import("prettier").Config}
 * @see https://prettier.io/docs/en/configuration
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    printWidth: 100,
    useTabs: false,
    bracketSpacing: true,
    overrides: [
        {
            files: ["*.css", "*.scss", "*.less"],
            options: {
                printWidth: 9999,
            },
        },
    ],
};

export default config;
