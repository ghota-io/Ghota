import { useState, useRef, useCallback } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Copy, Check } from 'lucide-react'

function CodeBlock({ children }) {
    const [copied, setCopied] = useState(false)
    const codeRef = useRef(null)

    const handleCopy = useCallback(async () => {
        const text = codeRef.current?.textContent || ''
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback: clipboard not available
        }
    }, [])

    return (
        <div className="relative group my-1">
            <button onClick={handleCopy}
                className="absolute right-2 top-2 z-10 p-1.5 rounded-md bg-white/80 dark:bg-[#2b2d31]/80 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-[#1e1f22] shadow-sm">
                {copied
                    ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5" />
                }
            </button>
            <pre ref={codeRef}
                className="bg-gray-100 dark:bg-[#1e1f22] border border-gray-200 dark:border-[#1e1f22] rounded-lg p-3 text-sm overflow-x-auto">
                {children}
            </pre>
        </div>
    )
}

function TableWrap({ children }) {
    return (
        <div className="overflow-x-auto my-1">
            <table className="w-full border-collapse [&_th]:border [&_th]:border-gray-200 dark:[&_th]:border-[#1e1f22] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:bg-gray-50 dark:[&_th]:bg-[#1e1f22] [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_td]:border [&_td]:border-gray-200 dark:[&_td]:border-[#1e1f22] [&_td]:px-2 [&_td]:py-1">
                {children}
            </table>
        </div>
    )
}

function ImageBox({ src, alt }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <span className="relative inline-block max-w-full my-1 align-top rounded-lg overflow-hidden leading-none">
            <img
                src={src}
                alt={alt || ''}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`max-w-full rounded-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!loaded && (
                <span className="absolute inset-0 min-h-[60px] bg-gray-100 dark:bg-[#1e1f22]" />
            )}
        </span>
    )
}

function MarkdownLink({ href, children }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-violet-600 dark:text-violet-400 underline hover:text-violet-700 dark:hover:text-violet-300">
            {children}
        </a>
    )
}

export default function MarkdownRenderer({ content, className = '' }) {
    return (
        <div className={`text-sm text-gray-800 dark:text-gray-200 break-words [&_p]:my-0 [&_p]:leading-relaxed [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:bg-gray-100 dark:[&_code]:bg-[#1e1f22] [&_code]:rounded [&_code]:text-[13px] [&_code]:font-normal [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-gray-600 [&_blockquote]:pl-3 [&_blockquote]:my-1 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-base [&_h4]:text-sm [&_h5]:text-sm [&_h6]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-normal [&_h5]:font-normal [&_h6]:font-normal [&_h1]:mt-3 [&_h2]:mt-2 [&_h3]:mt-1.5 [&_h4]:mt-0 [&_h5]:mt-0 [&_h6]:mt-0 [&_h1]:mb-1 [&_h2]:mb-1 [&_h3]:mb-0.5 [&_h4]:mb-0 [&_h5]:mb-0 [&_h6]:mb-0 [&_hr]:my-2 [&_hr]:border-gray-200 dark:[&_hr]:border-[#1e1f22] ${className}`}>
            <Markdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    a: MarkdownLink,
                    pre: CodeBlock,
                    table: TableWrap,
                    img: ImageBox,
                }}
            >
                {content}
            </Markdown>
        </div>
    )
}
