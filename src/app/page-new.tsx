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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Caldera Allocation Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check your potential token allocation based on Discord community roles and on-chain activity across Caldera chains
          </p>
        </div>

        {/* Progress Display */}
        {progress && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{progress.message}</span>
                <span className="text-sm text-gray-500">{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
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

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>
            This is an unofficial allocation checker. Results are estimates based on publicly available data.
          </p>
          <p className="mt-2">
            Built for the Caldera community • {' '}
            <a 
              href="https://caldera.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn more about Caldera
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
