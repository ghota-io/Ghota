import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export default function MessageInput({ channel, onSend }) {
    const [content, setContent] = useState('')
    const [sending, setSending] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [channel.id])

    useEffect(() => {
        if (!sending) {
            inputRef.current?.focus()
        }
    }, [sending])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const text = content.trim()
        if (!text || sending) return

        setSending(true)
        try {
            await onSend(text)
            setContent('')
        } finally {
            setSending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="shrink-0 px-5 pb-5 pt-2 bg-gray-50 dark:bg-[#1e1f22]">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    ref={inputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    placeholder={`Mensagem para # ${channel.name}`}
                    className="w-full bg-white dark:bg-[#2b2d31] text-gray-900 dark:text-white text-sm px-4 py-3 pr-12 rounded-lg outline-none border border-gray-200 dark:border-[#1e1f22] focus:border-violet-400/50 dark:focus:border-violet-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-colors disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
