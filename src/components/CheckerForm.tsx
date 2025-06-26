'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DISCORD_ROLES } from '@/config/roles'
import { Wallet, Users, Search } from 'lucide-react'

interface CheckerFormProps {
  onSubmit: (walletAddress: string, selectedRoles: string[]) => Promise<void>
  isLoading: boolean
  error?: string
}

export function CheckerForm({ onSubmit, isLoading, error }: CheckerFormProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const errors: string[] = []
    
    if (!walletAddress.trim()) {
      errors.push('Wallet address is required')
    } else if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Invalid wallet address format (must be 42 characters starting with 0x)')
    }

    if (selectedRoles.length === 0) {
      errors.push('Please select at least one Discord role')
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(walletAddress, selectedRoles)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
    // Clear errors when user makes changes
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 sm:p-12">
        <form onSubmit={handleSubmit} className="space-y-8 xs:space-y-10 sm:space-y-12">
          {/* Wallet Address Input */}
          <div className="space-y-4 xs:space-y-5 text-center">
            <label htmlFor="wallet" className="text-white font-semibold text-base xs:text-lg sm:text-xl flex items-center gap-2 justify-center mb-2">
              <Wallet size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              Wallet Address
            </label>
            <Input
              id="wallet"
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder-white/50 h-12 xs:h-14 text-base xs:text-lg sm:text-xl focus:bg-white/20 focus:border-white/50 transition-all w-full text-center rounded-none"
              disabled={isLoading}
            />
          </div>

          {/* Discord Roles Selection */}
          <div className="space-y-5 xs:space-y-6 text-center">
            <label className="text-white font-semibold text-base xs:text-lg sm:text-xl flex items-center gap-2 justify-center mb-2">
              <Users size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              Discord Roles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 max-h-64 overflow-y-auto">
              {DISCORD_ROLES.map((role) => (
                <label
                  key={role.id}
                  className={`flex items-center space-x-3 xs:space-x-4 p-4 xs:p-5 cursor-pointer transition-all min-h-[48px] ${
                    selectedRoles.includes(role.id)
                      ? 'bg-white/20 border-white/40 border-2'
                      : 'bg-white/5 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="w-5 h-5 rounded border-white/30 text-white focus:ring-white/50 bg-white/10 flex-shrink-0"
                    disabled={isLoading}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm xs:text-base sm:text-lg truncate">{role.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 p-5 xs:p-6 text-center">
              <h4 className="text-red-300 font-semibold mb-4 text-base xs:text-lg">Please fix the following:</h4>
              <ul className="text-red-200 space-y-2 text-sm xs:text-base">
                {formErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submission Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-5 xs:p-6 text-center">
              <p className="text-red-200 text-sm xs:text-base">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="w-full max-w-md h-12 xs:h-14 sm:h-16 text-base xs:text-lg sm:text-xl font-semibold bg-white text-black hover:bg-white/90 transition-all disabled:bg-white/50 rounded-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-3" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Search size={18} className="mr-3 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  CHECK ALLOCATION
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 xs:mt-10 sm:mt-12 p-6 xs:p-8 sm:p-10 bg-white/5 border border-white/10 text-center">
          <h3 className="font-semibold text-white mb-4 xs:mb-5 text-base xs:text-lg sm:text-xl">Analysis includes:</h3>
          <ul className="text-white/80 space-y-3 xs:space-y-4 text-sm xs:text-base text-center">
            <li>• Discord community roles verification</li>
            <li>• Transaction history across 10+ Caldera chains</li>
            <li>• Cross-chain bridge activity & gas spending</li>
            <li>• DeFi interactions and ecosystem engagement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
