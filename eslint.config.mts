// eslint.config.mts

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file
 * @type {import("eslint").Linter.Config}
 */
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
    // TypeScript + TSX
    {
        files: ['./src/**/*.ts', './src/**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            // optional: any custom rules here
        },
    },

    // Astro
    ...eslintPluginAstro.configs.recommended,

    // Prettier last
    eslintConfigPrettier,
]
