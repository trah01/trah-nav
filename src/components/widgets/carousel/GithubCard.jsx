import { RiGithubFill } from '@remixicon/react'

const GithubCard = ({ url }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-[200px] bg-slate-900 rounded-[24px] p-4 text-white flex flex-col justify-center items-center relative overflow-hidden group shadow-xl transition-transform border border-slate-800"
        >
            <RiGithubFill size={48} className="mb-2 group-hover:text-blue-400 transition-colors" />
            <span className="font-mono text-sm opacity-80 group-hover:opacity-100">Check Updates</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
        </a>
    )
}

export default GithubCard
