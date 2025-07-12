import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowRight, CheckCircle, School, Megaphone, Target, CreditCard } from 'lucide-react'
import { SchoolAuthProvider, useSchoolAuth } from '../contexts/SchoolAuthContext'
import SchoolLogin from '../components/promo/SchoolLogin'
import AudienceSelector from '../components/promo/AudienceSelector'
import ContentUploader from '../components/promo/ContentUploader'
import PricingCalculator from '../components/promo/PricingCalculator'
import PaymentOptions from '../components/promo/PaymentOptions'
import { createAdCampaign } from '../lib/directoryService'
import type { CreateAdRequest } from '../types/database'

type Step = 'audience' | 'content' | 'pricing' | 'payment' | 'success'

const PromoBoostContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useSchoolAuth()
  const [currentStep, setCurrentStep] = useState<Step>('audience')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Campaign Data
  const [campaignData, setCampaignData] = useState({
    reachCount: 250,
    durationDays: 7,
    targetAudience: {
      county: undefined as string | undefined,
      city: undefined as string | undefined,
      education_levels: [] as string[],
      professions: [] as string[]
    },
    adType: 'text' as 'banner' | 'text' | 'video',
    adContent: '',
    adFile: null as File | null,
    adFileUrl: undefined as string | undefined,
    pricing: 0
  })

  const [paymentResult, setPaymentResult] = useState<{
    reference: string
    amount: number
    method: string
  } | null>(null)

  const steps = [
    { id: 'audience', label: 'Target Audience', icon: Target },
    { id: 'content', label: 'Ad Content', icon: Megaphone },
    { id: 'pricing', label: 'Review & Pricing', icon: School },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'success', label: 'Complete', icon: CheckCircle }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  if (!isAuthenticated) {
    return <SchoolLogin onLoginSuccess={() => setCurrentStep('audience')} />
  }

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as Step)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as Step)
    }
  }

  const handlePaymentComplete = async (paymentData: {
    method: string
    reference: string
    amount: number
  }) => {
    setLoading(true)
    setError('')

    try {
      if (!user) throw new Error('User not authenticated')

      const adRequest: CreateAdRequest = {
        school_id: user.school.id,
        school_type: user.school.source,
        ad_content: campaignData.adContent,
        ad_type: campaignData.adType,
        ad_file_url: campaignData.adFileUrl,
        target_audience: campaignData.targetAudience,
        reach_count: campaignData.reachCount,
        duration_days: campaignData.durationDays
      }

      const result = await createAdCampaign(adRequest)

      if (result.success) {
        setPaymentResult(paymentData)
        setCurrentStep('success')
      } else {
        throw new Error('Failed to create campaign')
      }
    } catch (error) {
      setError('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 'audience':
        return campaignData.reachCount > 0 && campaignData.durationDays > 0
      case 'content':
        if (campaignData.adType === 'text') {
          return campaignData.adContent.length > 0
        }
        return !!campaignData.adFileUrl
      case 'pricing':
        return campaignData.pricing > 0
      case 'payment':
        return false // Payment handles its own completion
      default:
        return false
    }
  }

  return (
    <>
      <Helmet>
        <title>DSVI Promo Boost Console - Promote Your School</title>
        <meta name="description" content="Create targeted promotional campaigns for your school in the DSVI Directory. Reach parents, students, and educators across Liberia." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <School className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">DSVI Promo Boost</span>
                  <div className="text-sm text-gray-500">{user?.school.name}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = index < currentStepIndex
                const isAccessible = index <= currentStepIndex

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white'
                            : isAccessible
                            ? 'bg-gray-300 text-gray-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-2">
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${
                        index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {currentStep === 'audience' && (
                  <AudienceSelector
                    reachCount={campaignData.reachCount}
                    durationDays={campaignData.durationDays}
                    targetAudience={campaignData.targetAudience}
                    onReachChange={(reach) => setCampaignData(prev => ({ ...prev, reachCount: reach }))}
                    onDurationChange={(days) => setCampaignData(prev => ({ ...prev, durationDays: days }))}
                    onTargetAudienceChange={(audience) => setCampaignData(prev => ({ ...prev, targetAudience: audience }))}
                  />
                )}

                {currentStep === 'content' && (
                  <ContentUploader
                    adType={campaignData.adType}
                    adContent={campaignData.adContent}
                    adFileUrl={campaignData.adFileUrl}
                    onAdTypeChange={(type) => setCampaignData(prev => ({ ...prev, adType: type }))}
                    onAdContentChange={(content) => setCampaignData(prev => ({ ...prev, adContent: content }))}
                    onAdFileChange={(file, url) => setCampaignData(prev => ({ 
                      ...prev, 
                      adFile: file, 
                      adFileUrl: url 
                    }))}
                  />
                )}

                {currentStep === 'pricing' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Campaign Review</h3>
                    
                    {/* Campaign Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Campaign Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">School:</span>
                          <span className="font-medium">{user?.school.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ad Type:</span>
                          <span className="font-medium capitalize">{campaignData.adType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reach:</span>
                          <span className="font-medium">{campaignData.reachCount.toLocaleString()} viewers</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{campaignData.durationDays} days</span>
                        </div>
                        {campaignData.targetAudience.county && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">County:</span>
                            <span className="font-medium">{campaignData.targetAudience.county}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ad Preview */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Ad Preview</h4>
                      <div className="bg-white border rounded p-3">
                        {campaignData.adType === 'text' && (
                          <div className="text-sm">{campaignData.adContent}</div>
                        )}
                        {campaignData.adType === 'banner' && campaignData.adFileUrl && (
                          <div className="space-y-2">
                            <img src={campaignData.adFileUrl} alt="Ad banner" className="max-w-full h-auto rounded" />
                            {campaignData.adContent && (
                              <div className="text-sm text-gray-700">{campaignData.adContent}</div>
                            )}
                          </div>
                        )}
                        {campaignData.adType === 'video' && campaignData.adFileUrl && (
                          <div className="space-y-2">
                            <video src={campaignData.adFileUrl} controls className="max-w-full h-auto rounded" />
                            {campaignData.adContent && (
                              <div className="text-sm text-gray-700">{campaignData.adContent}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <PaymentOptions
                    totalPrice={campaignData.pricing}
                    onPaymentComplete={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                  />
                )}

                {currentStep === 'success' && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Campaign Created Successfully!</h3>
                    <p className="text-gray-600 mb-6">
                      Your promotional campaign has been submitted for review. You'll receive confirmation within 24 hours.
                    </p>
                    
                    {paymentResult && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-green-900 mb-2">Payment Confirmed</h4>
                        <div className="text-sm text-green-700">
                          <p>Reference: {paymentResult.reference}</p>
                          <p>Amount: ${paymentResult.amount.toFixed(2)}</p>
                          <p>Method: {paymentResult.method.replace('_', ' ').toUpperCase()}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-x-4">
                      <button
                        onClick={() => {
                          setCampaignData({
                            reachCount: 250,
                            durationDays: 7,
                            targetAudience: {
                              county: undefined,
                              city: undefined,
                              education_levels: [],
                              professions: []
                            },
                            adType: 'text',
                            adContent: '',
                            adFile: null,
                            adFileUrl: undefined,
                            pricing: 0
                          })
                          setCurrentStep('audience')
                          setPaymentResult(null)
                          setError('')
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Another Campaign
                      </button>
                      <a
                        href="/"
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-block"
                      >
                        Return to Directory
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {currentStep !== 'success' && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep !== 'payment' && (
                    <button
                      onClick={handleNext}
                      disabled={!canProceedToNext() || loading}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>
                        {currentStep === 'pricing' ? 'Proceed to Payment' : 'Next'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {(currentStep === 'audience' || currentStep === 'content' || currentStep === 'pricing') && (
                <PricingCalculator
                  reachCount={campaignData.reachCount}
                  durationDays={campaignData.durationDays}
                  targetAudience={campaignData.targetAudience}
                  onPriceCalculated={(price) => setCampaignData(prev => ({ ...prev, pricing: price }))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PromoBoost: React.FC = () => {
  return (
    <SchoolAuthProvider>
      <PromoBoostContent />
    </SchoolAuthProvider>
  )
}

export default PromoBoost
