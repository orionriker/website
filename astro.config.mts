// astro.config.mts

/**
 * @see https://astro.build/config
 * @type {import('astro').AstroUserConfig}
 */
import { defineConfig } from 'astro/config'

// Integrations
import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'
import preact from '@astrojs/preact'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: node({ mode: 'standalone' }),

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
        svgo: true,
        clientPrerender: true,
        preserveScriptOrder: true,
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
            minify: 'oxc',
            manifest: true,

            modulePreload: { polyfill: false },
            cssCodeSplit: true,
            assetsInlineLimit: 4096,

            // Smaller chunks = better caching
            chunkSizeWarningLimit: 500,
        },

        // Dependency optimization
        optimizeDeps: {
            // Include heavy deps
            include: ['@iconify/react', 'motion', 'preact', 'preact/compat'],
            // Exclude server-only deps
            exclude: ['@astrojs/node'],
        },

        // Enable resolver caching
        resolve: {
            dedupe: ['preact', 'preact/compat'],
        },

        ssr: {
            noExternal: [
                '@iconify/react',
                'motion',
                'motion/react',
                'framer-motion',
            ],
        },
    },
})
