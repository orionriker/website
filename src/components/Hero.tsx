import { LazyMotion, m } from 'motion/react'
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
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
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
        <LazyMotion features={() => import('@lib/motion-features')} strict>
            <m.div
                className="hero-reveal flex flex-col items-center gap-4 text-center sm:gap-7 md:gap-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <m.h1
                    className="type-site-hero hero-reveal"
                    variants={itemVariants}
                >
                    Orion C. Riker.
                </m.h1>

                <m.p
                    className="type-intro text-text-primary hero-reveal max-w-2xl"
                    variants={itemVariants}
                >
                    Full Stack Developer. Federationist. Designer. Maker.
                </m.p>

                <m.div
                    className="hero-reveal flex flex-wrap justify-center gap-2"
                    variants={itemVariants}
                >
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            aria-label={link.label}
                            href={link.href}
                            target="_blank"
                            className="hero-chip-container group"
                        >
                            <span className="hero-chip chip p-2.5! sm:p-3!">
                                <Icon name={link.icon} width="20" height="20" />
                            </span>
                        </a>
                    ))}
                </m.div>
            </m.div>
        </LazyMotion>
    )
}
