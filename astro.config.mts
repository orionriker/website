// astro.config.mts

/**
 * @see https://astro.build/config
 * @type {import('astro').AstroUserConfig}
 */
import {
    defineConfig,
    fontProviders,
    memoryCache,
    logHandlers,
} from 'astro/config'

const isBuild = process.argv.includes('build')

// The exact codepoint set the generated latin subsets cover, declared on the
// subset faces so any other codepoint falls through to the full-coverage
// sources instead of last-matching them. See src/assets/fonts/README.md.
const LATIN_RANGE: [string, ...string[]] = [
    'U+0000-00FF',
    'U+0131',
    'U+0152-0153',
    'U+02BB-02BC',
    'U+02C6',
    'U+02DA',
    'U+02DC',
    'U+0304',
    'U+0308',
    'U+0329',
    'U+2000-206F',
    'U+20AC',
    'U+2122',
    'U+2191',
    'U+2193',
    'U+2212',
    'U+2215',
    'U+FEFF',
    'U+FFFD',
]

// Ranges the Mona Sans variable sources actually carry (cmap-verified), kept
// disjoint from LATIN_RANGE so latin text never triggers their download.
// U+20B9 (₹) is the only currency the en_IN content needs out of these.
const MONA_EXT: [string, ...string[]] = [
    'U+0100-0130',
    'U+0132-0137',
    'U+0139-0151',
    'U+0154-017E',
    'U+0192',
    'U+01A0-01A1',
    'U+01AF-01B0',
    'U+01E6-01E7',
    'U+0218-021B',
    'U+0237',
    'U+1EA0-1EF9',
    'U+20A9',
    'U+20AA',
    'U+20B8',
    'U+20B9',
    'U+20BA',
    'U+20BF',
]

// Same shape for the Fira Mono full weights; plus the greek and cyrillic
// blocks Fira Mono covers and Mona Sans does not.
const FIRA_EXT: [string, ...string[]] = [
    'U+0100-0130',
    'U+0132-0151',
    'U+0154-017E',
    'U+0192',
    'U+01FC-01FF',
    'U+0218-021B',
    'U+0237',
    'U+0370-03FF',
    'U+0400-0479',
    'U+048A-04FF',
    'U+20AF',
    'U+20B9-20BA',
    'U+20BD',
]

// Local provider that records which source files are latin subsets
// (`*-Latin-*.woff2`) versus full-coverage sources, so preload filters can
// address one or the other by `subset`.
function subsetFontProvider() {
    const base = fontProviders.local()
    return {
        name: 'local-subset',
        init: (context: Parameters<NonNullable<typeof base.init>>[0]) =>
            base.init?.(context),
        async resolveFont(options: NonNullable<Parameters<typeof base.resolveFont>>[0]) {
            const result = await base.resolveFont?.(options)
            for (const face of result?.fonts ?? []) {
                const url =
                    'url' in face.src[0] ? String(face.src[0].url) : String(face.src[0].name ?? '')
                face.meta = { ...face.meta, subset: url.includes('-Latin-') ? 'latin' : 'ext' }
            }
            return { fonts: result?.fonts ?? [] }
        },
    }
}
const subsetLocal = subsetFontProvider()

// Integrations
//import node from '@astrojs/node'
import bun from '@wyattjoh/astro-bun-adapter'
import tailwindcss from '@tailwindcss/vite'
import preact from '@astrojs/preact'
import iconpruner from '@lib/vite-plugin-icon-pruner'

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: bun(),

    cache: { provider: memoryCache() },
    routeRules: {
        '/': { maxAge: 300, swr: 60 },
        '/projects': { maxAge: 300, swr: 60 },
    },

    logger: logHandlers.console(),

    integrations: [
        (await import('@playform/compress')).default({
            CSS: false,
            HTML: false,
            Image: true,
            JavaScript: true,
            JSON: true,
            SVG: true,
        }),
        preact({
            compat: true,
            devtools: false,
        }),
    ],

    experimental: {
        clientPrerender: true,
    },

    i18n: {
        defaultLocale: 'en_IN',
        locales: ['en_IN'],
        routing: { prefixDefaultLocale: false },
    },

    vite: {
        plugins: [tailwindcss(), iconpruner()],

        build: {
            target: 'es2023',
            minify: true,
            manifest: true,

            modulePreload: { polyfill: false },
            cssCodeSplit: true,
            assetsInlineLimit: 4096,

            chunkSizeWarningLimit: 5000,
        },

        optimizeDeps: {
            include: ['motion', 'preact', 'preact/compat'],
            exclude: ['@astrojs/node', '@wyattjoh/astro-bun-adapter'],
        },

        ssr: {
            noExternal: isBuild ? true : ['motion', 'framer-motion'],
            external: ['sharp'],
        },

        resolve: {
            tsconfigPaths: true,

            dedupe: [
                'preact',
                'preact/hooks',
                'preact/compat',
                'react',
                'react-dom',
            ],
        },
    },

    fonts: [
        {
            provider: subsetLocal,
            name: 'Mona Sans',
            cssVariable: '--font-mona',
            options: {
                variants: [
                    {
                        weight: '400',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-Latin-400.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        weight: '500',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-Latin-500.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        weight: '600',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-Latin-600.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        weight: '700',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-Latin-700.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        // Full-coverage variable source; matches any requested weight.
                        weight: '200 900',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-VariableFont.woff2',
                        ],
                        unicodeRange: MONA_EXT,
                    },
                    {
                        weight: '200 900',
                        style: 'italic',
                        src: [
                            './src/assets/fonts/Mona_Sans/MonaSans-Italic-VariableFont.woff2',
                        ],
                        unicodeRange: MONA_EXT,
                    },
                ],
            },
        },
        {
            provider: fontProviders.local(),
            name: 'Instrument Serif',
            cssVariable: '--font-instrument',
            options: {
                variants: [
                    {
                        weight: '400',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Instrument_Serif/InstrumentSerif-Regular.woff2',
                        ],
                    },
                ],
            },
        },
        {
            provider: subsetLocal,
            name: 'Fira Mono',
            cssVariable: '--font-fira',
            options: {
                variants: [
                    {
                        weight: '400',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Fira_Mono/FiraMono-Latin-400.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        weight: '500',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Fira_Mono/FiraMono-Latin-500.woff2',
                        ],
                        unicodeRange: LATIN_RANGE,
                    },
                    {
                        weight: '400',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Fira_Mono/FiraMono-Regular.woff2',
                        ],
                        unicodeRange: FIRA_EXT,
                    },
                    {
                        weight: '500',
                        style: 'normal',
                        src: [
                            './src/assets/fonts/Fira_Mono/FiraMono-Medium.woff2',
                        ],
                        unicodeRange: FIRA_EXT,
                    },
                ],
            },
        },
    ],
})
