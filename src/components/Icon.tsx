import { memo } from 'preact/compat'
import type { VNode } from 'preact'

import mdiData from '@iconify-json/mdi/icons.json'
import cibData from '@iconify-json/cib/icons.json'

interface IconData {
    body: string
    width?: number
    height?: number
}

const iconSets = [
    {
        prefix: mdiData.prefix,
        icons: mdiData.icons as Record<string, IconData>,
    },
    {
        prefix: cibData.prefix,
        icons: cibData.icons as Record<string, IconData>,
    },
]

function getIcon(icon: string): (IconData & { viewBox: string }) | null {
    const colonIndex = icon.indexOf(':')
    if (colonIndex === -1) return null

    const prefix = icon.substring(0, colonIndex)
    const name = icon.substring(colonIndex + 1)

    const set = iconSets.find((s) => s.prefix === prefix)
    if (!set) return null

    const data = set.icons[name]
    if (!data) return null

    const width = data.width ?? 24
    const height = data.height ?? 24

    return {
        body: data.body,
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
    }
}

interface IconProps {
    icon: string
    width?: number | string
    height?: number | string
    class?: string
}

const Icon = memo(function Icon({
    icon,
    width = 24,
    height = 24,
    class: className,
}: IconProps): VNode | null {
    const data = getIcon(icon)
    if (!data) return null

    return (
        <svg
            width={width}
            height={height}
            viewBox={data.viewBox}
            class={className}
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: data.body }}
        />
    )
})

export default Icon
