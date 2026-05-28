// astro.config.mts

/**
 * @see https://astro.build/config
 * @type {import('astro').AstroUserConfig}
 */
import { defineConfig } from 'astro/config'

const isBuild = process.argv.includes('build')

// Integrations
//import node from '@astrojs/node'
import bun from '@wyattjoh/astro-bun-adapter'
import tailwindcss from '@tailwindcss/vite'
import preact from '@astrojs/preact'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: bun(),

    integrations: [
        (await import('@playform/compress')).default({
            CSS: false, // Let Astro handle CSS
            HTML: true,
            Image: true,
            JavaScript: true,
            JSON: true,
            SVG: true,
        }),
        preact({
            compat: true,
            // Devtools off in production for smaller bundle
            devtools: false,
        }),
        icon(),
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
        plugins: [tailwindcss()],

        build: {
            target: 'es2023',
            minify: true,
            manifest: true,

            modulePreload: { polyfill: false },
            cssCodeSplit: true,
            assetsInlineLimit: 4096,

            // Smaller chunks = better caching
            chunkSizeWarningLimit: 500,
        },

        optimizeDeps: {
            // Include heavy deps
            include: ['@iconify/react', 'motion', 'preact', 'preact/compat'],
            // Exclude server-only deps
            exclude: ['@astrojs/node', '@wyattjoh/astro-bun-adapter'],
        },

        ssr: {
            noExternal: isBuild ? true : ['motion', 'framer-motion'],
            external: ['sharp'],
        },

        resolve: {
            // Forces Vite to use a single, shared instance of Preact/React
            dedupe: [
                'preact',
                'preact/hooks',
                'preact/compat',
                'react',
                'react-dom',
            ],
        },
    },
})
