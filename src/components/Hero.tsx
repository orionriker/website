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
            className="flex flex-col justify-center gap-5 p-4 xl:flex-row xl:items-center xl:justify-between"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-row flex-wrap items-start gap-2 sm:gap-4">
                <motion.h1
                    className="text-5xl font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-3xl xl:text-6xl"
                    variants={itemVariants}
                >
                    Orion C. Riker.
                </motion.h1>
                <motion.h1
                    className="from-base-100 to-accent-400 bg-gradient-to-r bg-clip-text text-[8.5cqw] font-extrabold tracking-tighter text-balance text-transparent sm:text-6xl lg:text-3xl xl:text-6xl"
                    variants={itemVariants}
                >
                    Full Stack Developer
                </motion.h1>
            </div>
            <motion.div
                className="flex w-full flex-col items-start gap-5 xl:w-162.5"
                variants={itemVariants}
            >
                <p className="mt-1 text-2xl font-bold text-balance sm:text-wrap">
                    I{' '}
                    <span className="text-accent-400 animate-pulse font-mono transition-colors duration-300">
                        {'{develop}'}
                    </span>{' '}
                    software. I automate server infrastructure. I architect
                    global governance. My directive is engineering better
                    systems for the Human race.
                </p>
                <div className="flex gap-2">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            aria-label={link.label}
                            href={link.href}
                            target="_blank"
                            className="hero-chip-container group"
                        >
                            <span className="hero-chip chip p-3!">
                                <Icon icon={link.icon} width="20" height="20" />
                            </span>
                        </a>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
