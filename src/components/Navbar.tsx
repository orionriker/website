import { useState, useEffect } from 'preact/hooks'
import ThemeBtn from '@components/ThemeBtn'
import ImageAvatar from '@images/avatar-96.webp'

const Pages = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/projects', label: 'Projects' },
]

const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div class="sticky top-0 z-50">
            <div
                class={`navbar h-20 transition-[background,backdrop-filter,box-shadow] duration-300 ${scrolled ? 'bg-base-950/85 shadow-elevation-1 backdrop-blur-frost' : 'bg-base-950/60 backdrop-blur-frost'}`}
            >
                <div class="page-container flex items-center justify-between gap-3">
                    <a
                        href="/"
                        class="flex min-w-0 items-center gap-3"
                        aria-label="Orion C. Riker home"
                    >
                        <img
                            src={ImageAvatar.src}
                            alt="Orion C. Riker Avatar"
                            class="h-10 w-10 shrink-0 rounded-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                        />
                    </a>
                    <div class="navbar-end">
                        <ThemeBtn />
                        <button
                            type="button"
                            class="text-base-950 ease-out-quint h-11 cursor-pointer rounded-full bg-gray-900 px-5 text-sm leading-none font-medium tracking-[-0.03em] transition-[color,background-color,transform] duration-200 hover:bg-gray-600 active:scale-[0.98] motion-reduce:transition-none dark:bg-gray-100 dark:hover:bg-gray-300"
                            aria-expanded={isMenuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            {isMenuOpen ? 'Close' : 'Menu'}
                        </button>
                    </div>
                </div>
            </div>

            <div
                class={`nav-menu absolute right-0 left-0 ${
                    scrolled ? 'shadow-lg shadow-black/10' : ''
                }`}
                style={{ top: 'calc(100% - 1px)' }}
                aria-hidden={!isMenuOpen}
            >
                <div class="nav-menu-clip">
                    <div
                        class={
                            scrolled
                                ? 'bg-base-950/85 backdrop-blur-frost'
                                : 'bg-base-950/60 backdrop-blur-frost'
                        }
                    >
                        <div class="page-container">
                            <ul class="flex w-full flex-col gap-2 pt-2 pb-6">
                                {Pages.map((page) => (
                                    <li key={page.href}>
                                        <a
                                            href={page.href}
                                            class="font-display hover:text-accent-500 block py-2 text-4xl font-normal tracking-[-0.04em] text-balance transition-colors duration-200 ease-out sm:text-5xl"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                        >
                                            {page.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
