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
            if (inputRef.current) {
                inputRef.current.style.height = 'auto'
            }
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

    const handleInput = (e) => {
        const el = e.currentTarget
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
    }

    return (
        <div className="shrink-0 px-5 pb-5 pt-2 bg-gray-50 dark:bg-[#1e1f22]">
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    ref={inputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    placeholder={`Mensagem para # ${channel.name}`}
                    rows={1}
                    className="w-full bg-white dark:bg-[#2b2d31] text-gray-900 dark:text-white text-sm px-4 py-3 pr-12 rounded-lg border-0 focus:border-0 outline-none focus:outline-none ring-0 focus:ring-0 focus:ring-transparent focus:shadow-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors disabled:opacity-50 resize-none overflow-hidden"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="absolute right-2 bottom-2.5 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#35373c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
