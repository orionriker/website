export const prerender = false

/**
 * @param {import('astro').APIContext} context
 * @returns {Response}
 */
import type { APIContext } from 'astro'
export function GET({}: APIContext) {
    return new Response(JSON.stringify({ healthy: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
