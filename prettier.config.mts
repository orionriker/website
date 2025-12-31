// prettier.config.mts

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    tabWidth: 4,

    singleQuote: true,
    semi: false,

    trailingComma: 'es5',

    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',

    plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-astro'],
}

export default config
