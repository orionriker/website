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
    i18n: {
        defaultLocale: 'en_IN',
        locales: ['en_IN'],
        routing: {
            prefixDefaultLocale: false,
        },
    },

    adapter: node({ mode: 'standalone' }),
    integrations: [preact({ compat: true }), icon()],
    output: 'server',

    vite: {
        build: {
            target: 'es2022',
            minify: 'oxc',
            sourcemap: false,
            manifest: true,
        },

        plugins: [tailwindcss()],

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
