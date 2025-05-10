'use client'

import React, { useState, useEffect } from 'react'
import { Send, Mic, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'

export default function ChatbotPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return

      try {
        const res = await axios.get('/api/chatbot/history')
        setMessages(res.data.messages)
      } catch (err) {
        console.error('Erreur lors du chargement de l’historique :', err)
      }
    }

    fetchHistory()
  }, [user])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'PATIENT', message: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/chatbot', { message: input })
      const botMessage = {
        sender: 'BOT',
        message: res.data.reply,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Erreur lors de l’envoi au chatbot :', err)
      setMessages((prev) => [
        ...prev,
        { sender: 'BOT', message: "Erreur lors de la réponse du chatbot." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Reconnaissance vocale non supportée par ce navigateur.")
      return
    }

    if (listening) return

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale :', event.error)
      if (event.error === 'no-speech') {
        alert('Aucun son détecté. Réessaie de parler clairement.')
      }
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognition.start()
  }

  return (
    <div className="p-4 max-w-7xl mx-auto"> 
      <h1 className="text-4xl font-semibold text-center mb-6 text-blue-600">💬 Chatbot Santé</h1>

      <div className="bg-gradient-to-r from-indigo-200 to-blue-300 p-6 rounded-2xl shadow-xl h-[800px] overflow-y-auto mb-4 space-y-4 border border-gray-300">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl max-w-[80%] text-lg transition-all duration-300 ease-in-out ${
              msg.sender === 'BOT'
                ? 'bg-blue-200 text-left self-start shadow-lg border-l-4 border-blue-500'
                : 'bg-green-200 text-right self-end ml-auto shadow-lg border-l-4 border-green-500'
            }`}
            style={{
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            <span>{msg.message}</span>
          </div>
        ))}
        {loading && <div className="text-blue-500 text-sm">Le bot écrit...</div>}
        {listening && <div className="text-green-500 text-sm">🎙 En écoute...</div>}
      </div>

      <div className="flex gap-4 items-center">
        <input
          className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          placeholder="Pose ta question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 transition-all transform hover:scale-110"
          onClick={startListening}
          disabled={listening}
        >
          <Mic size={20} />
        </button>
        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110 disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  )
}
