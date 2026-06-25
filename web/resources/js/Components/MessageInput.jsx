import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export default function MessageInput({ channel, onSend }) {
    const [content, setContent] = useState('')
    const [sending, setSending] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [channel.id])

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
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="shrink-0 px-5 pb-5 pt-2">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    ref={inputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    placeholder={`Mensagem para # ${channel.name}`}
                    className="w-full bg-[#1a0038] text-white text-sm px-4 py-3 pr-12 rounded-lg outline-none border border-white/10 focus:border-[#6C3BFF]/50 placeholder-white/30 transition-colors disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
