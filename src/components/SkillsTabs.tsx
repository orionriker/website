import { useState } from 'preact/hooks'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './Icon'

const skillCategories = [
    {
        id: 'languages',
        label: 'Languages',
        icon: 'mdi:xml',
        skills: [
            { name: 'TypeScript', level: 'Proficient' },
            { name: 'JavaScript', level: 'Proficient' },
            { name: 'Python', level: 'Proficient' },
            { name: 'PHP', level: 'Proficient' },
            { name: 'C', level: 'Proficient' },
            { name: 'C++', level: 'Proficient' },
            { name: 'C#', level: 'Proficient' },
            { name: 'Java', level: 'Learning' },
            { name: 'Ruby', level: 'Learning' },
            { name: 'Bun', level: 'Proficient' },
            { name: 'Node.js', level: 'Proficient' },
            { name: 'GLSL', level: 'Proficient' },
        ],
    },
    {
        id: 'frameworks',
        label: 'Frameworks',
        icon: 'mdi:application-braces-outline',
        skills: [
            { name: 'React.js', level: 'Proficient' },
            { name: 'Angular.js', level: 'Learning' },
            { name: 'Astro', level: 'Proficient' },
            { name: 'Laravel', level: 'Proficient' },
            { name: 'Express', level: 'Proficient' },
            { name: 'TailwindCSS', level: 'Proficient' },
            { name: 'Sass', level: 'Proficient' },
        ],
    },
    {
        id: 'devops',
        label: 'DevOps',
        icon: 'mdi:cogs',
        skills: [
            { name: 'Docker', level: 'Proficient' },
            { name: 'Kubernetes', level: 'Learning' },
            { name: 'Git', level: 'Proficient' },
            { name: 'GitHub', level: 'Proficient' },
            { name: 'Gitlab', level: 'Proficient' },
            { name: 'Jenkins', level: 'Proficient' },
            { name: 'Grafana', level: 'Proficient' },
            { name: 'Prometheus', level: 'Proficient' },
        ],
    },
    {
        id: 'databases',
        label: 'Databases',
        icon: 'mdi:database',
        skills: [
            { name: 'MySQL', level: 'Proficient' },
            { name: 'PostgreSQL', level: 'Proficient' },
            { name: 'Redis', level: 'Proficient' },
            { name: 'MongoDB', level: 'Proficient' },
        ],
    },
    {
        id: 'tools',
        label: 'Tools',
        icon: 'mdi:tools',
        skills: [
            { name: 'VS Code', level: 'Proficient' },
            { name: 'Visual Studio', level: 'Proficient' },
            { name: 'Vim', level: 'Proficient' },
            { name: 'Unreal Engine', level: 'Learning' },
            { name: 'Unity', level: 'Proficient' },
            { name: 'Godot', level: 'Learning' },
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
            { name: 'Scratch', level: 'Proficient' },
            { name: 'Assembly', level: 'Learning' },
            { name: 'R', level: 'Learning' },
            { name: 'SQL', level: 'Proficient' },
        ],
    },
]

export default function SkillsTabs() {
    const [activeTab, setActiveTab] = useState(skillCategories[0].id)

    return (
        <div>
            <div class="mb-8 flex flex-wrap gap-2">
                {skillCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                            activeTab === category.id
                                ? 'bg-accent-400 text-white'
                                : 'bg-base-800 text-base-300 hover:bg-base-700'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Icon icon={category.icon} width={16} height={16} />
                            {category.label}
                        </span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
                >
                    {skillCategories
                        .find((c) => c.id === activeTab)
                        ?.skills.map((skill) => (
                            <motion.div
                                key={skill.name}
                                whileHover={{ x: 4 }}
                                className={`skill-card ${
                                    skill.level === 'Learning'
                                        ? 'border-dashed opacity-75'
                                        : ''
                                }`}
                            >
                                <h4 className="font-semibold">{skill.name}</h4>
                                {skill.level === 'Learning' && (
                                    <span className="text-accent-400 mt-1 block text-xs">
                                        Learning
                                    </span>
                                )}
                            </motion.div>
                        ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
