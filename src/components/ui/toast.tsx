'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300 px-4">
      <div className={`${bgColor} text-white px-4 xs:px-6 py-2 xs:py-3 rounded shadow-lg flex items-center gap-2 xs:gap-3 max-w-sm`}>
        <Check size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
        <span className="font-medium text-sm xs:text-base">{message}</span>
      </div>
    </div>
  )
}
