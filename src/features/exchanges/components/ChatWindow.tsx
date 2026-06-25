'use client'

import { useRef, useEffect, useState } from 'react'
import { Message } from '@/features/exchanges/queries/getExchangeMessages'
import { sendMessage } from '@/features/exchanges/actions/sendMessage'
import { markMessagesRead } from '@/features/exchanges/actions/markMessagesRead'
import { createClient } from '@/lib/supabase/client'

export function ChatWindow({
  exchangeId,
  messages,
  currentUserId,
  otherUser,
  exchangeStatus
}: {
  exchangeId: string
  messages: Message[]
  currentUserId: string
  otherUser: any
  exchangeStatus: string | null
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSending, setIsSending] = useState(false)
  const [liveMessages, setLiveMessages] = useState<Message[]>(messages)

  useEffect(() => {
    setLiveMessages(messages)
  }, [messages])

  useEffect(() => {
    markMessagesRead(exchangeId)
    const supabase = createClient()
    const channel = supabase
      .channel(`chat-${exchangeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `exchange_id=eq.${exchangeId}` },
        (payload) => {
          const newMsg = payload.new as any
          setLiveMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [
              ...prev,
              {
                ...newMsg,
                sender: newMsg.sender_id === currentUserId ? { id: currentUserId } : otherUser,
              },
            ]
          })
          if (newMsg.sender_id !== currentUserId) {
            markMessagesRead(exchangeId)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [exchangeId, currentUserId, otherUser])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [liveMessages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    
    const formData = new FormData(e.currentTarget)
    await sendMessage(formData)
    
    formRef.current?.reset()
    setIsSending(false)
  }

  return (
    <div className="md:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-[0_2px_10px_-2px_rgba(45,106,79,0.06)] overflow-hidden h-[700px] border border-outline-variant/20">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-surface-variant flex items-center justify-between bg-surface-container-lowest z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (otherUser?.id || 'default')}
              alt={otherUser?.full_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary-container" 
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
          </div>
          <div>
            <h2 className="font-headline-sm text-[20px] leading-tight text-on-surface font-bold">{otherUser?.full_name}</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-normal flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
              Verified Neighbor
            </p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:bg-secondary-container/50 p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-background/50">
        {liveMessages.length === 0 ? (
          <div className="text-center text-on-surface-variant font-body-md mt-10">
            No messages yet. Say hello!
          </div>
        ) : (
          liveMessages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            const timeStr = new Date(msg.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            if (isMe) {
              return (
                <div key={msg.id} className="flex flex-col gap-1 max-w-[80%] ml-auto items-end">
                  <div className="bg-primary text-on-primary shadow-sm rounded-2xl rounded-br-sm px-4 py-3 relative overflow-hidden">
                    <p className="font-body-md text-[15px] leading-relaxed relative z-10 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-1 mr-1">
                    <span className="font-label-sm text-[11px] text-on-surface-variant font-normal">{timeStr}</span>
                    <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={msg.id} className="flex items-end gap-2 max-w-[80%]">
                  <img 
                    src={msg.sender?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (msg.sender?.id || 'default')}
                    alt={msg.sender?.full_name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mb-1" 
                  />
                  <div className="flex flex-col gap-1">
                    <div className="bg-surface-container-lowest text-on-surface shadow-[0_2px_10px_-2px_rgba(45,106,79,0.06)] rounded-2xl rounded-bl-sm px-4 py-3 border border-surface-variant/50">
                      <p className="font-body-md text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="font-label-sm text-[11px] text-on-surface-variant font-normal ml-1">{timeStr}</span>
                  </div>
                </div>
              )
            }
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Privacy Note */}
      <div className="bg-secondary-container/30 px-6 py-2 text-center border-t border-surface-variant/50">
        <p className="font-label-sm text-label-sm text-on-surface-variant font-normal flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Messages are only visible to both parties in this exchange.
        </p>
      </div>

      {/* Input Area */}
      {exchangeStatus === 'Cancelled' || exchangeStatus === 'Completed' || exchangeStatus === 'Disputed' ? (
        <div className="p-4 bg-surface-container-lowest border-t border-surface-variant z-10 text-center">
          <p className="text-on-surface-variant font-body-md py-4">This exchange is closed. Messaging is disabled.</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="p-4 bg-surface-container-lowest border-t border-surface-variant z-10">
        <input type="hidden" name="exchange_id" value={exchangeId} />
        <div className="flex items-end gap-3 bg-surface-container-low rounded-xl border-[1.5px] border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-tertiary-container/10 transition-all p-2">
          <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-secondary-container/50 rounded-full shrink-0 mb-0.5">
            <span className="material-symbols-outlined">add_photo_alternate</span>
          </button>
          <textarea 
            name="content"
            required
            className="w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md placeholder:text-outline resize-none py-2.5 max-h-32 min-h-[44px] outline-none" 
            placeholder="Type your message..." 
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = ''
              target.style.height = target.scrollHeight + 'px'
            }}
          ></textarea>
          <button 
            type="submit" 
            disabled={isSending}
            className="bg-primary disabled:opacity-50 text-on-primary p-2.5 rounded-lg shadow-sm hover:bg-on-primary-fixed-variant transition-colors shrink-0 mb-0.5 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </form>
      )}
    </div>
  )
}
