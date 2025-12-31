import { useState } from 'preact/hooks'
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

    const menuVariants = {
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                height: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
                opacity: { duration: 0.2 },
                when: 'afterChildren',
            },
        },
        open: {
            height: 'auto',
            opacity: 1,
            transition: {
                height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                opacity: { duration: 0.3 },
                when: 'beforeChildren',
            },
        },
    }

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

    return (
        <>
            <div class="navbar h-[80px]">
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

            <AnimatePresence initial={false}>
                {isMenuOpen && (
                    <motion.div
                        class="page-container my-10 overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <motion.ul
                            class="items-left flex w-full flex-col justify-start gap-4 pt-2 pb-8"
                            variants={containerVariants}
                        >
                            {Pages.map((page) => (
                                <motion.li
                                    key={page.num}
                                    class="border-base-800 flex flex-row gap-2 border-b pb-4"
                                    variants={itemVariants}
                                >
                                    <span class="font-mono text-sm font-medium opacity-100">
                                        {page.num}
                                    </span>
                                    <a
                                        href={page.href}
                                        class="text-6xl font-bold tracking-tighter text-balance transition-opacity duration-300 ease-in-out hover:opacity-55"
                                    >
                                        {page.label}
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <hr class="border-base-800 m-0 p-0 shadow-md" />
        </>
    )
}

export default Navbar
