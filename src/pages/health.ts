export const prerender = false

/**
 * @param {import('astro').APIContext} context
 * @returns {Response}
 */
export function GET(context: any) {
    return new Response(JSON.stringify({ healthy: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
