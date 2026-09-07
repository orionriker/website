import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

type IconifyIconsJSON = {
    prefix: string
    icons: Record<string, { body: string; width?: number; height?: number }>
    width?: number
    height?: number
}

const ICON_REF_REGEX = /(['"`])(mdi|cib):([a-z0-9-]+)\1/g
const SOURCE_EXT = /\.(ts|tsx|astro)$/

function scanSourceDir(
    dir: string,
    found: Set<string> = new Set()
): Set<string> {
    let entries: string[] = []
    try {
        entries = readdirSync(dir)
    } catch {
        return found
    }

    for (const entry of entries) {
        const fullPath = join(dir, entry)
        try {
            if (statSync(fullPath).isDirectory()) {
                scanSourceDir(fullPath, found)
            } else if (SOURCE_EXT.test(entry)) {
                const content = readFileSync(fullPath, 'utf-8')
                let match
                while ((match = ICON_REF_REGEX.exec(content)) !== null) {
                    found.add(`${match[2]}:${match[3]}`)
                }
            }
        } catch {
            // Skip unreadable files (e.g. node_modules inside src)
        }
    }

    return found
}

function pruneIconSet(
    json: IconifyIconsJSON,
    prefix: string,
    usedIcons: Set<string>
): IconifyIconsJSON {
    const needed = [...usedIcons]
        .filter((i) => i.startsWith(`${prefix}:`))
        .map((i) => i.slice(prefix.length + 1))

    const icons: Record<
        string,
        { body: string; width?: number; height?: number }
    > = {}
    for (const key of needed) {
        if (json.icons[key]) {
            icons[key] = { ...json.icons[key] }
        }
    }

    const pruned: IconifyIconsJSON = { prefix, icons }
    if (json.width) pruned.width = json.width
    if (json.height) pruned.height = json.height
    return pruned
}

export default function iconPruner() {
    let cachedIcons: Set<string> | null = null

    const getUsedIcons = () => {
        if (!cachedIcons) {
            cachedIcons = scanSourceDir(join(process.cwd(), 'src'))
        }
        return cachedIcons
    }

    return {
        name: 'vite-plugin-icon-pruner',
        enforce: 'pre' as const,
        load(id: string) {
            if (
                id.endsWith('@iconify-json/mdi/icons.json') ||
                id.endsWith('@iconify-json/cib/icons.json')
            ) {
                const json = JSON.parse(
                    readFileSync(id, 'utf-8')
                ) as IconifyIconsJSON
                const pruned = pruneIconSet(json, json.prefix, getUsedIcons())
                return JSON.stringify(pruned)
            }
            return null
        },
        handleHotUpdate({ file }: { file: string }) {
            if (SOURCE_EXT.test(file)) {
                cachedIcons = null // Force re-scan on next load
            }
        },
    }
}
