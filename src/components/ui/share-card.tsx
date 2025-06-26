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
        className={`w-[640px] h-[640px] relative overflow-hidden ${className}`}
        style={{ 
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #dc2626 50%, #991b1b 75%, #1f2937 100%)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
      {/* Background Pattern with Noise and Blur */}
      <div className="absolute inset-0" style={{ opacity: 0.3 }}>
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(153, 27, 27, 0.3) 0%, transparent 50%)
            `,
            filter: 'blur(1px)'
          }} 
        />
        {/* Noise overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply'
          }}
        />
      </div>

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
