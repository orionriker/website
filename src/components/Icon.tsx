import { memo } from 'preact/compat'
import type { VNode } from 'preact'

import mdiData from '@iconify-json/mdi/icons.json'
import cibData from '@iconify-json/cib/icons.json'

interface IconData {
    body: string
    width?: number
    height?: number
}

interface IconifyJSON {
    prefix: string
    icons: Record<string, IconData>
    width?: number
    height?: number
}

const iconSets = [
    {
        prefix: mdiData.prefix,
        icons: mdiData.icons as Record<string, IconData>,
        width: (mdiData as unknown as IconifyJSON).width,
        height: (mdiData as unknown as IconifyJSON).height,
    },
    {
        prefix: cibData.prefix,
        icons: cibData.icons as Record<string, IconData>,
        width: (cibData as unknown as IconifyJSON).width,
        height: (cibData as unknown as IconifyJSON).height,
    },
]

function getIcon(icon: string): (IconData & { viewBox: string }) | null {
    if (!icon || typeof icon !== 'string') return null

    const colonIndex = icon.indexOf(':')
    if (colonIndex === -1) return null

    const prefix = icon.substring(0, colonIndex)
    const name = icon.substring(colonIndex + 1)

    const set = iconSets.find((s) => s.prefix === prefix)
    if (!set) return null

    const data = set.icons[name]
    if (!data) return null

    const width = data.width ?? set.width ?? 24
    const height = data.height ?? set.height ?? 24

    return {
        body: data.body,
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
    }
}

interface IconProps {
    name: string
    size?: number | string
    width?: number | string
    height?: number | string
    class?: string
}

const Icon = memo(function Icon({
    name,
    size,
    width,
    height,
    class: className,
}: IconProps): VNode | null {
    if (!name || typeof name !== 'string') return null

    const data = getIcon(name)
    if (!data) return null

    const finalWidth = width ?? size ?? 24
    const finalHeight = height ?? size ?? 24

    return (
        <svg
            width={finalWidth}
            height={finalHeight}
            viewBox={data.viewBox}
            class={className}
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: data.body }}
        />
    )
})

export default Icon
