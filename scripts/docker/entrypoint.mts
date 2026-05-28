// entrypoint.mts

import { existsSync, readdirSync, cpSync, mkdirSync } from 'fs'
import { spawn } from 'child_process'
import { resolve } from 'path'

// Validate and sanitize paths
const PUBLIC_DIR = resolve('/app/public')
const DEFAULT_DIR = resolve('/app/public-default')

// Security: Ensure paths are within expected boundaries
if (!PUBLIC_DIR.startsWith('/app/') || !DEFAULT_DIR.startsWith('/app/')) {
    console.error('Error: Invalid directory paths')
    process.exit(1)
}

// Validate that source directory exists
if (!existsSync(DEFAULT_DIR)) {
    console.error('Error: Default public data directory not found')
    process.exit(1)
}

try {
    // Ensure public directory exists
    if (!existsSync(PUBLIC_DIR)) {
        mkdirSync(PUBLIC_DIR, { recursive: true, mode: 0o755 })
    }

    // Check if /app/public is empty (ignore lost+found from ext4 filesystems)
    const entries = readdirSync(PUBLIC_DIR).filter(
        (name) => name !== 'lost+found'
    )
    const isEmpty = entries.length === 0

    if (isEmpty) {
        console.log('Populating /app/public with default data...')

        // Security: Use mode to set proper permissions, prevent symlink attacks
        cpSync(DEFAULT_DIR, PUBLIC_DIR, {
            recursive: true,
            errorOnExist: false,
            force: false, // Don't overwrite if somehow files appeared
            preserveTimestamps: true,
            verbatimSymlinks: false, // Resolve symlinks for security
        })

        console.log('✓ Default public data copied successfully')
    }
} catch (error) {
    console.error('Error during initialization:', error)
    process.exit(1)
}

// Validate command exists
if (!process.argv[2]) {
    console.error('Error: No command specified')
    process.exit(1)
}

// Execute the main command
const [cmd, ...args] = process.argv.slice(2)

// Security: Validate command doesn't contain path traversal
if (cmd.includes('..') || cmd.includes('\0')) {
    console.error('Error: Invalid command')
    process.exit(1)
}

const child = spawn(cmd, args, {
    stdio: 'inherit',
    // Security: Don't allow shell interpretation
    shell: false,
})

// Handle errors
child.on('error', (error) => {
    console.error('Failed to start process:', error)
    process.exit(1)
})

// Forward exit code
child.on('exit', (code, signal) => {
    if (signal) {
        console.error(`Process killed with signal ${signal}`)
        process.exit(1)
    }
    process.exit(code ?? 1)
})

// Handle termination signals gracefully
process.on('SIGTERM', () => {
    child.kill('SIGTERM')
})

process.on('SIGINT', () => {
    child.kill('SIGINT')
})
