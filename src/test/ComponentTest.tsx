import React from 'react'
import AudienceSelector from '../components/promo/AudienceSelector'
import PricingCalculator from '../components/promo/PricingCalculator'
import ContentUploader from '../components/promo/ContentUploader'

// Basic smoke test component to verify our components can render
const ComponentTest: React.FC = () => {
  const [testData, setTestData] = React.useState({
    reachCount: 250,
    durationDays: 7,
    targetAudience: {
      county: undefined as string | undefined,
      city: undefined as string | undefined,
      education_levels: [] as string[],
      professions: [] as string[]
    },
    adType: 'text' as 'banner' | 'text' | 'video',
    adContent: 'Test ad content',
    adFileUrl: undefined as string | undefined,
    pricing: 0
  })

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Component Smoke Test</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Audience Selector</h2>
          <AudienceSelector
            reachCount={testData.reachCount}
            durationDays={testData.durationDays}
            targetAudience={testData.targetAudience}
            onReachChange={(reach) => setTestData(prev => ({ ...prev, reachCount: reach }))}
            onDurationChange={(days) => setTestData(prev => ({ ...prev, durationDays: days }))}
            onTargetAudienceChange={(audience) => setTestData(prev => ({ ...prev, targetAudience: audience }))}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Pricing Calculator</h2>
          <PricingCalculator
            reachCount={testData.reachCount}
            durationDays={testData.durationDays}
            targetAudience={testData.targetAudience}
            onPriceCalculated={(price) => setTestData(prev => ({ ...prev, pricing: price }))}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Content Uploader</h2>
        <ContentUploader
          adType={testData.adType}
          adContent={testData.adContent}
          adFileUrl={testData.adFileUrl}
          onAdTypeChange={(type) => setTestData(prev => ({ ...prev, adType: type }))}
          onAdContentChange={(content) => setTestData(prev => ({ ...prev, adContent: content }))}
          onAdFileChange={(file, url) => setTestData(prev => ({ 
            ...prev, 
            adFileUrl: url 
          }))}
        />
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Current State:</h3>
        <pre className="text-sm">{JSON.stringify(testData, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ComponentTest