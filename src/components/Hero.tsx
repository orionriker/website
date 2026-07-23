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

const bgContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
}
const bgBlobVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.25 },
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
        <>
            <motion.div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
                variants={bgContainerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Accent/Cyan Blob (Top Left) */}
                <motion.div
                    variants={bgBlobVariants}
                    className="from-accent-500/35 md:from-accent-500/30 dark:from-accent-400/15 md:dark:from-accent-400/10 absolute -top-[10%] -left-[10%] h-[70%] w-[90%] -rotate-12 rounded-full bg-gradient-to-br to-cyan-500/35 blur-[100px] md:w-[60%] md:to-cyan-500/30 md:blur-[120px] dark:to-cyan-400/15 md:dark:to-cyan-400/10"
                />
                {/* Violet/Fuchsia Blob (Center) */}
                <motion.div
                    variants={bgBlobVariants}
                    className="absolute top-[20%] left-[10%] h-[50%] w-[90%] rotate-12 rounded-full bg-gradient-to-tr from-violet-500/35 to-fuchsia-500/35 blur-[100px] md:left-[20%] md:w-[60%] md:from-violet-500/30 md:to-fuchsia-500/30 md:blur-[140px] dark:from-violet-400/15 dark:to-fuchsia-400/15 md:dark:from-violet-400/10 md:dark:to-fuchsia-400/10"
                />
                {/* Red/Orange Blob (Bottom Right) */}
                <motion.div
                    variants={bgBlobVariants}
                    className="absolute -right-[10%] -bottom-[10%] h-[70%] w-[80%] -rotate-12 rounded-full bg-gradient-to-bl from-red-500/35 to-orange-500/35 blur-[100px] md:w-[50%] md:from-red-500/30 md:to-orange-500/30 md:blur-[120px] dark:from-red-400/15 dark:to-orange-400/15 md:dark:from-red-400/10 md:dark:to-orange-400/10"
                />
            </motion.div>
            <motion.div
                className="flex flex-col gap-10 xl:flex-row xl:justify-between"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex min-w-0 flex-col items-start justify-center">
                    <motion.h1
                        className="text-[clamp(3rem,9vw,4.5rem)] leading-tight font-extrabold tracking-tighter text-balance"
                        variants={itemVariants}
                    >
                        Orion C. Riker.
                    </motion.h1>
                    <motion.h2
                        className="text-text-secondary text-[clamp(1.25rem,4vw,2rem)] leading-snug font-medium tracking-tight text-pretty"
                        variants={itemVariants}
                    >
                        Full Stack Developer. Federationist. Designer. Maker.
                    </motion.h2>
                </div>
                <motion.div
                    className="flex w-full flex-col items-start gap-5 xl:max-w-fit"
                    variants={itemVariants}
                >
                    <p className="flex flex-col text-[clamp(1.1rem,4vw,1.7rem)] leading-relaxed font-semibold">
                        <span>
                            I{' '}
                            <span className="from-accent-500 dark:from-accent-400 animate-pulse bg-gradient-to-r to-teal-500 bg-clip-text font-mono text-transparent dark:to-teal-400">
                                {'{build}'}
                            </span>{' '}
                            software.
                        </span>
                        <span>
                            I{' '}
                            <span className="animate-pulse bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text font-mono text-transparent dark:from-red-400 dark:to-orange-400">
                                {'(automate)'}
                            </span>{' '}
                            infrastructure.
                        </span>
                        <span>
                            I{' '}
                            <span className="animate-pulse bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text font-mono text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                                {'[architect]'}
                            </span>{' '}
                            global governance.
                        </span>
                        <span>From software to civilization.</span>
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
                                    <Icon
                                        name={link.icon}
                                        width="20"
                                        height="20"
                                    />
                                </span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    )
}
