'use client'

import { useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  // Determine icon and color based on message content
  const isError = message.toLowerCase().includes('error')
  const isDownload = message.toLowerCase().includes('download')
  const bgColor = isError ? 'bg-red-600' : isDownload ? 'bg-blue-600' : 'bg-green-600'

  return (
    <div 
      className="toast-container animate-in slide-in-from-top-2 duration-300 px-4"
    >
      <div className={`${bgColor} text-white px-4 xs:px-6 py-3 xs:py-4 rounded-lg shadow-2xl flex items-center gap-2 xs:gap-3 max-w-sm border-2 border-white/20`}>
        <Check size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
        <span className="font-semibold text-sm xs:text-base flex-1">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X size={14} className="xs:w-4 xs:h-4" />
        </button>
      </div>
    </div>
  )
}
