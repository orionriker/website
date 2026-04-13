import { motion } from 'motion/react'
import Icon from './Icon'

const socialLinks = [
    { label: 'Email', href: 'mailto:orionriker@proton.me', icon: 'mdi:email' },
    {
        label: 'Github',
        href: 'https://github.com/orionriker',
        icon: 'mdi:github',
    },
    {
        label: 'StackOverflow',
        href: 'https://stackoverflow.com/users/27994192/orionriker',
        icon: 'mdi:stack-overflow',
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/orionriker/',
        icon: 'mdi:linkedin',
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
    },
}

export default function Hero() {
    return (
        <motion.div
            class="flex flex-col justify-center gap-5 xl:flex-row xl:items-center xl:justify-between"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div class="flex flex-row flex-wrap items-start gap-2 sm:gap-4">
                <motion.h1
                    class="text-5xl font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-3xl xl:text-6xl"
                    variants={itemVariants}
                >
                    Orion C. Riker.
                </motion.h1>
                <motion.h1
                    class="text-4xl font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-3xl xl:text-6xl"
                    variants={itemVariants}
                >
                    Full Stack Developer
                </motion.h1>
            </div>
            <motion.div
                class="flex w-full flex-col items-start gap-5 xl:w-162.5"
                variants={itemVariants}
            >
                <p class="mt-1 text-2xl font-bold text-balance sm:text-wrap">
                    I{' '}
                    <span className="animate-pulse font-mono text-indigo-600 transition-colors duration-300 hover:text-indigo-500 dark:text-indigo-400">
                        {'{develop}'}
                    </span>{' '}
                    software that is aesthetically pleasing and emotionally
                    resonant. I also design user interfaces that are intuitive
                    and user-friendly.
                </p>
                <div className="flex gap-2">
                    {socialLinks.map((link) => (
                        <motion.a
                            key={link.label}
                            aria-label={link.label}
                            href={link.href}
                            target="_blank"
                            className="hero-chip-container group"
                            whileHover={{ y: -3, rotate: 2 }}
                            whileTap={{ y: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <span className="hero-chip chip p-3!">
                                <Icon icon={link.icon} width="20" height="20" />
                            </span>
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
