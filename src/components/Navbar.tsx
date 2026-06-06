import { useState, useEffect } from 'preact/hooks'
import { motion, AnimatePresence } from 'motion/react'
import ThemeBtn from '@components/ThemeBtn'
import ImageAvatar from '@images/avatar.svg'

const Pages = [
    { num: '01', href: '/', label: 'Home' },
    { num: '02', href: '/#about', label: 'About' },
    { num: '03', href: '/projects', label: 'Projects' },
]

const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const itemVariants = {
        closed: {
            x: -50,
            opacity: 0,
            transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] },
        },
        open: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
        },
    }

    const containerVariants = {
        open: { transition: { staggerChildren: 0.1 } },
        closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const glassBase = scrolled
        ? 'bg-base-950/80 backdrop-blur-md shadow-lg shadow-black/10'
        : 'bg-base-950/90 backdrop-blur-sm'

    return (
        <div class="sticky top-0 z-50">
            <div
                class={`navbar border-base-800 h-20 border-b transition-[background,backdrop-filter,box-shadow] duration-300 ${glassBase}`}
            >
                <div class="page-container flex justify-between">
                    <div class="navbar-start sm:w-full lg:w-max">
                        <a href="/" class="flex items-center">
                            <img
                                src={ImageAvatar.src}
                                alt="Orion C. Riker Avatar"
                                class="mx-auto h-12 w-auto rounded-full object-cover"
                                loading="eager"
                            />
                        </a>
                    </div>
                    <div class="navbar-end">
                        <ThemeBtn />
                        <button
                            class="rounded-full p-2 outline-0 hover:cursor-pointer"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label="Toggle Menu"
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.33, 1, 0.68, 1],
                                }}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isMenuOpen ? (
                                        <motion.svg
                                            key="close"
                                            viewBox="0 0 24 24"
                                            class="h-10 w-10"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path
                                                d="M19 5L5 19"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M19 19L5 5"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </motion.svg>
                                    ) : (
                                        <motion.svg
                                            key="menu"
                                            viewBox="0 0 24 24"
                                            class="h-10 w-10"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path
                                                d="M4.5 12H19.5"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                                stroke-linecap="round"
                                            />
                                            <path
                                                d="M4.5 17.7692H19.5"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                                stroke-linecap="round"
                                            />
                                            <path
                                                d="M4.5 6.23077H19.5"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                                stroke-linecap="round"
                                            />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        class={`absolute right-0 left-0 ${scrolled ? 'shadow-lg shadow-black/10' : ''}`}
                        style={{ top: 'calc(100% - 1px)' }}
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{
                            duration: 0.45,
                            ease: [0.33, 1, 0.68, 1],
                        }}
                    >
                        <div
                            class={`${scrolled ? 'bg-base-950/80 backdrop-blur-md' : 'bg-base-950/90 backdrop-blur-sm'}`}
                        >
                            <div class="page-container">
                                <motion.ul
                                    class="flex w-full flex-col gap-4 pt-2 pb-6"
                                    variants={containerVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    {Pages.map((page) => (
                                        <motion.li
                                            key={page.num}
                                            class="border-base-800 flex flex-row items-center gap-4 border-b pb-4"
                                            variants={itemVariants}
                                        >
                                            <span class="text-base-500 font-mono text-sm font-medium">
                                                {page.num}
                                            </span>
                                            <a
                                                href={page.href}
                                                class="text-5xl font-bold tracking-tighter text-balance transition-opacity duration-300 ease-in-out hover:opacity-55 sm:text-6xl"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                            >
                                                {page.label}
                                            </a>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                            <div class="border-base-800 border-b" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar
