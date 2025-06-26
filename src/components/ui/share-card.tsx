'use client'

import { forwardRef } from 'react'
import { UserAnalysis } from '@/types'

interface ShareCardProps {
  analysis: UserAnalysis
  className?: string
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ analysis, className = "" }, ref) => {
    const { allocationResult } = analysis

    return (
      <div 
        ref={ref}
        data-share-card="true"
        className={`relative overflow-hidden no-scale ${className}`}
        style={{ 
          width: '640px',
          height: '640px',
          minWidth: '640px',
          minHeight: '640px',
          maxWidth: '640px',
          maxHeight: '640px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          transform: 'none',
          transformOrigin: 'initial',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #dc2626 50%, #991b1b 75%, #1f2937 100%)'
        }}
      >
        {/* Simplified background pattern for html2canvas compatibility */}
        <div 
          className="absolute inset-0" 
          style={{ 
            opacity: 0.2,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)
            `
          }} 
        />

      {/* Content */}
      <div className="relative z-10 h-full text-center" style={{ padding: '60px 48px' }}>
        {/* Header - Positioned at top */}
        <div style={{ position: 'absolute', top: '80px', left: '0', right: '0' }}>
          <h1 
            className="text-4xl font-bold tracking-wide"
            style={{ 
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '0.1em'
            }}
          >
            CALDERA ALLOCATION
          </h1>
        </div>

        {/* Main Allocation - Centered vertically */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '0', 
          right: '0', 
          transform: 'translateY(-60px)' // Move up slightly from center
        }}>
          {allocationResult.isEligible ? (
            <>
              <div 
                className="text-8xl font-black leading-none"
                style={{ 
                  color: '#ffffff',
                  textShadow: '4px 4px 8px rgba(0,0,0,0.7)',
                  fontWeight: '900',
                  marginBottom: '40px'
                }}
              >
                {allocationResult.tokenAmount.toLocaleString()}
              </div>
              <div 
                className="text-2xl font-bold tracking-wider"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.15em'
                }}
              >
                $CALDERA
              </div>
            </>
          ) : (
            <>
              <div 
                className="text-8xl font-black leading-none"
                style={{ 
                  color: '#fca5a5',
                  textShadow: '4px 4px 8px rgba(0,0,0,0.7)',
                  fontWeight: '900',
                  marginBottom: '40px'
                }}
              >
                0
              </div>
              <div 
                className="text-2xl font-bold tracking-wider"
                style={{ 
                  color: '#f87171',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.15em'
                }}
              >
                INELIGIBLE
              </div>
            </>
          )}
        </div>

        {/* Footer - Positioned at bottom */}
        <div 
          className="text-sm"
          style={{ 
            position: 'absolute',
            bottom: '60px',
            left: '0',
            right: '0',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: '400'
          }}
        >
          made by @deepugami
        </div>
      </div>
    </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'
