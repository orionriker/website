import { useState } from 'preact/hooks'
import { motion } from 'motion/react'
import Icon from '@components/Icon'

type SkillLevel = 'Proficient' | 'PreviouslyUsed' | 'Learning'

interface Skill {
    name: string
    level: SkillLevel
}

interface Category {
    id: string
    label: string
    icon: string
    skills: Skill[]
}

const skillCategories: Category[] = [
    {
        id: 'languages',
        label: 'Languages',
        icon: 'mdi:xml',
        skills: [
            { name: 'HTML5', level: 'Proficient' },
            { name: 'CSS3', level: 'Proficient' },
            { name: 'JavaScript', level: 'Proficient' },
            { name: 'TypeScript', level: 'Proficient' },
            { name: 'C', level: 'Proficient' },
            { name: 'C++', level: 'Proficient' },
            { name: 'C#', level: 'Proficient' },
            { name: 'Python', level: 'Proficient' },
            { name: 'SQL', level: 'Proficient' },
            { name: 'Bun', level: 'Proficient' },
            { name: 'Node.js', level: 'Proficient' },
            { name: 'ASP.NET', level: 'PreviouslyUsed' },
            { name: 'PHP', level: 'PreviouslyUsed' },
            { name: 'GLSL', level: 'PreviouslyUsed' },
            { name: 'OpenGL', level: 'PreviouslyUsed' },
            { name: 'Ruby', level: 'PreviouslyUsed' },
            { name: 'Java', level: 'PreviouslyUsed' },
            { name: 'R', level: 'PreviouslyUsed' },
            { name: 'Assembly', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'frameworks',
        label: 'Frameworks',
        icon: 'mdi:application-braces-outline',
        skills: [
            { name: 'Astro', level: 'Proficient' },
            { name: 'React.js', level: 'Proficient' },
            { name: 'Sass', level: 'Proficient' },
            { name: 'TailwindCSS', level: 'Proficient' },
            { name: 'Bootstrap', level: 'PreviouslyUsed' },
            { name: 'Flask', level: 'PreviouslyUsed' },
            { name: 'Laravel', level: 'PreviouslyUsed' },
            { name: 'Express.js', level: 'PreviouslyUsed' },
            { name: 'Vue.js', level: 'PreviouslyUsed' },
            { name: 'Angular.js', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'ml-data-science',
        label: 'ML & Data Science',
        icon: 'mdi:chart-bell-curve-cumulative',
        skills: [
            { name: 'PyTorch', level: 'Proficient' },
            { name: 'TensorFlow', level: 'Proficient' },
            { name: 'Pandas', level: 'Proficient' },
            { name: 'NumPy', level: 'Proficient' },
            { name: 'Matplotlib', level: 'Proficient' },
            { name: 'Hugging Face', level: 'Proficient' },
        ],
    },
    {
        id: 'databases',
        label: 'Databases',
        icon: 'mdi:database',
        skills: [
            { name: 'PostgreSQL', level: 'Proficient' },
            { name: 'MySQL', level: 'Proficient' },
            { name: 'MongoDB', level: 'Proficient' },
            { name: 'Redis', level: 'Proficient' },
            { name: 'SQLite', level: 'Proficient' },
            { name: 'MariaDB', level: 'Proficient' },
        ],
    },
    {
        id: 'design',
        label: 'Design',
        icon: 'mdi:palette',
        skills: [
            { name: 'Figma', level: 'Proficient' },
            { name: 'Blender', level: 'Proficient' },
            { name: 'Fusion 360', level: 'Proficient' },
            { name: 'Onshape', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'devops-ci',
        label: 'DevOps & CI',
        icon: 'mdi:cogs',
        skills: [
            { name: 'Docker', level: 'Proficient' },
            { name: 'Kubernetes', level: 'Proficient' },
            { name: 'Git', level: 'Proficient' },
            { name: 'FluxCD', level: 'Proficient' },
            { name: 'Dependabot', level: 'Proficient' },
            { name: 'GitHub', level: 'Proficient' },
            { name: 'GitHub Actions', level: 'Proficient' },
            { name: 'GitLab', level: 'Proficient' },
            { name: 'GitLab CI', level: 'Proficient' },
            { name: 'Grafana', level: 'Proficient' },
            { name: 'Prometheus', level: 'Proficient' },
            { name: 'Jenkins', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'tools',
        label: 'Tools',
        icon: 'mdi:tools',
        skills: [
            { name: 'Linux', level: 'Proficient' },
            { name: 'Visual Studio', level: 'Proficient' },
            { name: 'VS Code', level: 'Proficient' },
            { name: 'VSCodium', level: 'Proficient' },
            { name: 'Vim', level: 'Proficient' },
            { name: 'Neovim', level: 'Proficient' },
            { name: 'Zen Browser', level: 'Proficient' },
            { name: 'Tor', level: 'Proficient' },
            { name: 'Arc', level: 'PreviouslyUsed' },
            { name: 'Google Chrome', level: 'PreviouslyUsed' },
            { name: 'Firefox', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'web',
        label: 'Web',
        icon: 'mdi:web',
        skills: [
            { name: 'Caddy', level: 'Proficient' },
            { name: 'Nginx', level: 'Proficient' },
            { name: 'Vite', level: 'Proficient' },
            { name: 'Cloudflare', level: 'Proficient' },
            { name: 'Apache', level: 'PreviouslyUsed' },
            { name: 'Webpack', level: 'PreviouslyUsed' },
            { name: 'Vercel', level: 'PreviouslyUsed' },
            { name: 'Netlify', level: 'PreviouslyUsed' },
        ],
    },
    {
        id: 'scripting',
        label: 'Scripting',
        icon: 'mdi:script',
        skills: [
            { name: 'Bash', level: 'Proficient' },
            { name: 'Batch', level: 'Proficient' },
            { name: 'PowerShell', level: 'Proficient' },
            { name: 'VBScript', level: 'Proficient' },
            { name: 'Scratch', level: 'Proficient' },
        ],
    },
    {
        id: 'game-dev',
        label: 'Game Development',
        icon: 'mdi:gamepad-variant',
        skills: [
            { name: 'Unity', level: 'Proficient' },
            { name: 'Unreal Engine', level: 'Proficient' },
            { name: 'Godot', level: 'Proficient' },
        ],
    },
    {
        id: 'cloud',
        label: 'Cloud Services',
        icon: 'mdi:cloud',
        skills: [
            { name: 'Hetzner', level: 'Proficient' },
            { name: 'Oracle Cloud', level: 'Proficient' },
            { name: 'Google Cloud', level: 'PreviouslyUsed' },
            { name: 'AWS', level: 'PreviouslyUsed' },
            { name: 'Microsoft Azure', level: 'PreviouslyUsed' },
        ],
    },
]

const levelOrder: SkillLevel[] = ['Proficient', 'PreviouslyUsed', 'Learning']

const levelLabels: Record<SkillLevel, string> = {
    Proficient: 'Currently Using',
    PreviouslyUsed: 'Previously Used',
    Learning: 'Learning',
}

export default function SkillsTabs() {
    const [activeTab, setActiveTab] = useState(skillCategories[0].id)

    const currentCategory = skillCategories.find((c) => c.id === activeTab)

    const groupedSkills = currentCategory
        ? levelOrder
              .map((level) => ({
                  level,
                  skills: currentCategory.skills.filter(
                      (s) => s.level === level
                  ),
              }))
              .filter((g) => g.skills.length > 0)
        : []

    return (
        <div class="flex flex-col gap-6 md:flex-row">
            <div class="relative md:w-50 md:shrink-0">
                <div
                    class="from-base-950 pointer-events-none absolute inset-y-0 left-0 z-12 w-20 rounded-l-3xl bg-linear-to-r to-transparent md:hidden"
                    id="shadow-left"
                    style="opacity:0"
                />
                <nav
                    class="skill-sidebar"
                    onScroll={(e) => {
                        const el = e.currentTarget
                        const left = document.getElementById('shadow-left')!
                        const right = document.getElementById('shadow-right')!
                        left.style.opacity = el.scrollLeft > 4 ? '1' : '0'
                        right.style.opacity =
                            el.scrollLeft < el.scrollWidth - el.clientWidth - 4
                                ? '1'
                                : '0'
                    }}
                >
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className="skill-sidebar-btn"
                        >
                            {activeTab === cat.id && (
                                <motion.div
                                    layoutId="active-bg"
                                    className="bg-base-100 absolute inset-0 rounded-2xl"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span
                                class={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
                                    activeTab === cat.id ? 'text-base-950' : ''
                                }`}
                            >
                                <Icon name={cat.icon} size={16} />
                                <span class="truncate">{cat.label}</span>
                            </span>
                        </button>
                    ))}
                </nav>
                <div
                    class="from-base-950 pointer-events-none absolute inset-y-0 right-0 z-12 w-20 rounded-r-3xl bg-linear-to-l to-transparent md:hidden"
                    id="shadow-right"
                />
            </div>

            <div class="min-w-0 flex-1">
                {groupedSkills.map((group) => (
                    <div key={group.level} class="mb-6 last:mb-0">
                        <p class="text-base-400 mb-3 text-xs font-medium tracking-wider uppercase">
                            {levelLabels[group.level]}
                        </p>
                        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {group.skills.map((skill) => (
                                <motion.div
                                    whileHover={{ scale: 1.04, y: -3 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 17,
                                    }}
                                    className="skill-card"
                                    data-level={skill.level}
                                >
                                    <span
                                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                            skill.level === 'Proficient'
                                                ? 'bg-accent-400'
                                                : skill.level === 'Learning'
                                                  ? 'bg-amber-500'
                                                  : 'bg-base-500'
                                        }`}
                                    />
                                    <div class="min-w-0">
                                        <p class="truncate leading-tight font-medium">
                                            {skill.name}
                                        </p>
                                        {skill.level === 'Learning' && (
                                            <p class="mt-0.5 text-xs text-amber-400">
                                                Learning
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
