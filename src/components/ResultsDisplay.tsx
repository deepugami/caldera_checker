'use client'

import { UserAnalysis } from '@/types'
import { Button } from '@/components/ui/button'
import { getRolesByIds } from '@/config/roles'
import { TwitterIcon } from '@/components/ui/twitter-icon'
import { ShareCard } from '@/components/ui/share-card'
import { 
  Copy,
  ExternalLink
} from 'lucide-react'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

interface ResultsDisplayProps {
  analysis: UserAnalysis
  onReset: () => void
  onShowToast?: (message: string) => void
}

export function ResultsDisplay({ analysis, onReset, onShowToast }: ResultsDisplayProps) {
  const { allocationResult, onChainMetrics, selectedRoles, eligibilityReasons } = analysis
  const userRoles = getRolesByIds(selectedRoles)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Detect if user is on mobile device
  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const handleShareClick = async () => {
    // Unified approach: generate and download image for all devices
    await generateAndDownloadImage()
    
    // Then open sharing options based on device
    setTimeout(() => {
      if (isMobile()) {
        // On mobile, open X profile
        window.open('https://x.com/deepugami', '_blank')
      } else {
        // On desktop, open Twitter intent
        const twitterText = encodeURIComponent(
          "I just checked my Caldera allocation using this unofficial checker: https://deepu-caldera.vercel.app"
        )
        const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`
        window.open(twitterUrl, '_blank')
      }
    }, 1000)
  }

  const generateAndDownloadImage = async () => {
    if (!shareCardRef.current || isGeneratingImage) return
    
    setIsGeneratingImage(true)
    
    try {
      // Keep the ShareCard hidden but accessible for capture
      const container = shareCardRef.current.parentElement
      if (container) {
        // Position it off-screen but still in the DOM
        container.style.position = 'fixed'
        container.style.top = '-10000px'
        container.style.left = '-10000px'
        container.style.zIndex = '-1'
        container.style.opacity = '1' // Make visible for html2canvas but keep off-screen
        container.style.visibility = 'visible'
        container.style.pointerEvents = 'none'
        container.style.width = '640px'
        container.style.height = '640px'
      }

      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 50))

      // Generate the image with optimized settings
      const canvas = await html2canvas(shareCardRef.current, {
        width: 640,
        height: 640,
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        removeContainer: false,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          // Ensure proper sizing in cloned document
          const clonedElement = clonedDoc.querySelector('[data-share-card]') as HTMLElement
          if (clonedElement) {
            clonedElement.style.width = '640px'
            clonedElement.style.height = '640px'
            clonedElement.style.minWidth = '640px'
            clonedElement.style.minHeight = '640px'
            clonedElement.style.maxWidth = '640px'
            clonedElement.style.maxHeight = '640px'
            clonedElement.style.transform = 'none'
          }
        }
      })
      
      // Keep the element hidden after capture
      if (container) {
        container.style.opacity = '0'
        container.style.visibility = 'hidden'
        container.style.zIndex = '-1'
        container.style.position = 'fixed'
        container.style.top = '-10000px'
        container.style.left = '-10000px'
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `caldera-allocation-${Date.now()}.png`
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          // Show toast notification immediately after download
          onShowToast?.('Image downloaded successfully!')
        } else {
          onShowToast?.('Failed to generate image')
        }
      }, 'image/png', 0.95)
      
    } catch (error) {
      console.error('Error generating image:', error)
      onShowToast?.('Error generating image')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <>
      {/* Hidden Share Card for Image Generation */}
      <div 
        className="fixed pointer-events-none no-scale" 
        style={{ 
          top: '-10000px',
          left: '-10000px',
          zIndex: -1,
          background: 'transparent',
          opacity: 0,
          visibility: 'hidden',
          width: '640px',
          height: '640px'
        }}
      >
        <ShareCard ref={shareCardRef} analysis={analysis} />
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-8 xs:space-y-12 sm:space-y-16 px-4 mb-12 component-container">
      {/* Header Section */}
      <div className="text-center space-y-6 xs:space-y-8 sm:space-y-12">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 sm:p-12">
          <div className="flex items-center justify-center gap-3 xs:gap-4 mb-6 xs:mb-8">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold">ALLOCATION RESULT</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 xs:gap-3 sm:gap-4 text-white/80">
            <span className="text-sm xs:text-base sm:text-lg">Wallet:</span>
            <div className="flex items-center justify-center gap-3">
              <code className="bg-white/10 px-3 xs:px-4 py-2 font-mono text-xs xs:text-sm sm:text-base whitespace-nowrap text-center">
                {formatAddress(analysis.walletAddress)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(analysis.walletAddress)}
                className="h-8 w-8 xs:h-10 xs:w-10 p-0 flex-shrink-0"
              >
                <Copy size={14} className="xs:w-4 xs:h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tier and Allocation - Main Display */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-10 xs:p-12 sm:p-16">
          {allocationResult.isEligible ? (
            <div className="text-center">
              <div className="mt-6 xs:mt-8 sm:mt-12">
                <p className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 xs:mb-4 break-words">
                  {allocationResult.tokenAmount.toLocaleString()} $CALDERA
                </p>
                <p className="text-white/60 text-sm xs:text-base sm:text-lg mb-6">
                  Token Allocation
                </p>
                
                {/* Share Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleShareClick}
                    disabled={isGeneratingImage}
                    className="bg-black hover:bg-gray-800 text-white border-0 px-4 xs:px-6 py-2 xs:py-3 rounded-none font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2 xs:gap-3 transition-all duration-200 disabled:opacity-50 min-w-[120px] xs:min-w-[140px] sm:min-w-[160px]"
                  >
                    <TwitterIcon size={16} className="xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" />
                    <span className="whitespace-nowrap">
                      {isGeneratingImage ? 'GENERATING...' : 'SHARE'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 text-lg font-bold text-red-300 bg-red-500/20 border border-red-500/30">
                <span>INELIGIBLE</span>
              </div>
              <div className="mt-6">
                <p className="text-xl font-bold text-red-300 mb-2">0 $CALDERA</p>
                <p className="text-red-400/80 text-sm mb-6">
                  {allocationResult.reason}
                </p>
                
                {/* Share Button for Ineligible */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleShareClick}
                    disabled={isGeneratingImage}
                    className="bg-black hover:bg-gray-800 text-white border-0 px-4 xs:px-6 py-2 xs:py-3 rounded-none font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2 xs:gap-3 transition-all duration-200 disabled:opacity-50 min-w-[120px] xs:min-w-[140px] sm:min-w-[160px]"
                  >
                    <TwitterIcon size={16} className="xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" />
                    <span className="whitespace-nowrap">
                      {isGeneratingImage ? 'GENERATING...' : 'SHARE'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-10">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 text-center">
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">
            {selectedRoles.includes('no-roles') ? 0 : userRoles.length}
          </div>
          <p className="text-white/60 text-sm xs:text-base sm:text-lg mt-2">Discord Roles</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 text-center">
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">{onChainMetrics.totalTransactions}</div>
          <p className="text-white/60 text-sm xs:text-base sm:text-lg mt-2">Total Transactions</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 text-center">
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">{onChainMetrics.uniqueChainsUsed}</div>
          <p className="text-white/60 text-sm xs:text-base sm:text-lg mt-2">Ecosystem Chains</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 xs:p-10 text-center">
          <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">{parseFloat(onChainMetrics.totalBalance).toFixed(4)}</div>
          <p className="text-white/60 text-sm xs:text-base sm:text-lg mt-2">Total ETH Balance</p>
        </div>
      </div>

      {/* Chain Activity Breakdown */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 xs:p-8 sm:p-10">
        <h3 className="text-xl xs:text-2xl font-bold text-white mb-6 xs:mb-8">
          Chain Activity
        </h3>
        <div className="space-y-6 xs:space-y-7">
          {onChainMetrics.chainBreakdown
            .sort((a, b) => b.transactionCount - a.transactionCount)
            .map((chain) => (
              <div 
                key={chain.chainName}
                className={`flex items-center justify-between p-6 xs:p-7 border transition-all ${
                  chain.isActive 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className={`w-3 h-3 xs:w-4 xs:h-4 ${
                    chain.isActive ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div className="text-left">
                    <p className="font-semibold text-white text-sm xs:text-base leading-tight">{chain.chainName}</p>
                    <p className={`text-xs xs:text-sm leading-tight ${
                      chain.isActive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {chain.isActive ? 'Active' : 'No activity'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm xs:text-base">
                    {chain.transactionCount.toLocaleString()} txs
                  </div>
                  <div className="text-white/60 text-xs xs:text-sm">
                    {parseFloat(chain.balance).toFixed(4)} ETH
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Discord Roles */}
      {userRoles.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 xs:p-8 sm:p-10">
          <h3 className="text-xl xs:text-2xl font-bold text-white mb-6 xs:mb-8">
            Discord Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5">
            {userRoles.map((role) => (
              <div 
                key={role.id}
                className="bg-white/5 border border-white/20 p-4 xs:p-5 text-center"
              >
                <p className="font-semibold text-white text-sm xs:text-base">{role.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eligibility Analysis */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 xs:p-8 sm:p-10">
        <h3 className="text-xl xs:text-2xl font-bold text-white mb-6 xs:mb-8">
          Analysis Summary
        </h3>
        <div className="space-y-3 xs:space-y-4">
          {eligibilityReasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-3 xs:gap-4 text-left">
              <span className="text-white/80 text-sm xs:text-base">{reason.replace(/✅/g, '')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 xs:gap-8 pt-6">
        <Button onClick={onReset} variant="outline" size="lg" className="w-full sm:w-auto min-w-[240px] h-12 xs:h-14">
          CHECK ANOTHER ADDRESS
        </Button>
        <Button 
          variant="ghost"
          size="lg"
          onClick={() => window.open('https://portal.caldera.xyz/', '_blank')}
          className="w-full sm:w-auto min-w-[240px] h-12 xs:h-14"
        >
          <ExternalLink size={20} className="mr-3" />
          EXPLORE CALDERA
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="bg-white/5 border border-white/10 p-8 xs:p-10 text-center">
        <p className="text-white/60 text-sm xs:text-base leading-relaxed">
          <strong>Disclaimer:</strong> This is an unofficial checker for demonstration purposes. 
          Actual token allocation criteria may differ significantly from these estimates.
        </p>
      </div>
      </div>
    </>
  )
}
