'use client'

import { useState } from 'react'
import { CheckerForm } from '@/components/CheckerForm'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { CalderaAnalysisService, AnalysisProgress } from '@/services/analysis'
import { UserAnalysis } from '@/types'

export default function Home() {
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState<AnalysisProgress | null>(null)

  const analysisService = new CalderaAnalysisService()

  const handleFormSubmit = async (walletAddress: string, selectedRoles: string[]) => {
    setIsLoading(true)
    setError('')
    setAnalysis(null)
    setProgress(null)

    try {
      // Validate inputs
      const validation = analysisService.validateInputs(walletAddress, selectedRoles)
      if (!validation.isValid) {
        setError(validation.errors.join(', '))
        return
      }

      // Run analysis with progress tracking
      const result = await analysisService.analyzeUser(
        walletAddress,
        selectedRoles,
        (progressUpdate) => setProgress(progressUpdate)
      )

      setAnalysis(result)
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setProgress(null)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setError('')
    setProgress(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-4 sm:py-8">
      {/* Header */}
      <div className="mb-16 sm:mb-20 md:mb-24 w-full text-center">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 md:mb-10 tracking-tight px-2">
          CALDERA
        </h1>
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold mb-6 sm:mb-8 md:mb-10 opacity-90 px-2">
          Allocation Checker
        </h2>
        <div className="flex justify-center w-full">
          <p className="text-sm xs:text-base sm:text-lg opacity-70 max-w-2xl mx-auto px-4 text-center leading-relaxed">
            Select your Discord roles and analyze on-chain metrics to determine potential token allocation eligibility
          </p>
        </div>
        <p className="text-sm opacity-90 mt-4 text-black">
          made by{' '}
          <a 
            href="https://x.com/deepugami" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black/80 hover:text-black transition-colors duration-200 underline"
          >
            @deepugami
          </a>
        </p>
      </div>

      {/* Progress Display */}
      {progress && (
        <div className="w-full max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-20 px-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 sm:p-8">
            <div className="flex flex-col xs:flex-row items-center justify-between mb-4 gap-2 text-center xs:text-left">
              <span className="text-white font-medium text-sm sm:text-base md:text-lg">{progress.message}</span>
              <span className="text-white/70 text-sm sm:text-base">{progress.progress}%</span>
            </div>
            <div className="w-full bg-black/30 h-3">
              <div 
                className="bg-white h-3 transition-all duration-500 ease-out"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

        {/* Main Content */}
        <div className="w-full flex flex-col items-center justify-center">
          {!analysis ? (
            <CheckerForm 
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <ResultsDisplay 
              analysis={analysis}
              onReset={handleReset}
            />
          )}
        </div>

      {/* Footer */}
      <footer className="mt-20 sm:mt-24 md:mt-28 opacity-60 w-full text-center px-4">
        <p className="text-xs sm:text-sm mb-2 sm:mb-3">
          Unofficial allocation checker • Results are estimates based on publicly available data
        </p>
        <p className="text-xs opacity-80">
          Built for the Caldera community • Max airdrop supply: 80M tokens
        </p>
      </footer>
    </div>
  )
}
