import React, { useState } from 'react'
import { CreditCard, Smartphone, Building, AlertCircle, Check, Loader2, Shield } from 'lucide-react'

interface PaymentOptionsProps {
  totalPrice: number
  onPaymentComplete: (paymentData: {
    method: string
    reference: string
    amount: number
  }) => void
  onPaymentError: (error: string) => void
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  totalPrice,
  onPaymentComplete,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'mobile_money' | 'card' | 'bank_transfer'>('mobile_money')
  const [processing, setProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    mobile_number: '',
    mobile_provider: 'mtn',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    card_name: '',
    bank_account: '',
    bank_name: ''
  })

  const paymentMethods = [
    {
      id: 'mobile_money' as const,
      name: 'Mobile Money',
      icon: Smartphone,
      description: 'MTN MoMo or Orange Money',
      popular: true
    },
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, or local cards',
      popular: false
    },
    {
      id: 'bank_transfer' as const,
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank transfer',
      popular: false
    }
  ]

  const mobileProviders = [
    { value: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-500' },
    { value: 'orange', label: 'Orange Money', color: 'bg-orange-500' }
  ]

  const liberianBanks = [
    'Ecobank Liberia',
    'United Bank for Africa (UBA)',
    'First International Bank (FIB)',
    'International Bank (Liberia)',
    'Guaranty Trust Bank (GTBank)',
    'Access Bank Liberia',
    'Other'
  ]

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generatePaymentReference = (): string => {
    return `DSVI_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  const processPayment = async () => {
    setProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reference = generatePaymentReference()
      
      // In a real implementation, you would integrate with:
      // - MTN MoMo API
      // - Orange Money API  
      // - Stripe/Paystack for cards
      // - Local banking APIs
      
      onPaymentComplete({
        method: selectedMethod,
        reference: reference,
        amount: totalPrice
      })
      
    } catch (error) {
      onPaymentError('Payment processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const isFormValid = (): boolean => {
    switch (selectedMethod) {
      case 'mobile_money':
        return paymentData.mobile_number.length >= 8
      case 'card':
        return paymentData.card_number.length >= 16 && 
               paymentData.card_expiry.length >= 5 && 
               paymentData.card_cvv.length >= 3 &&
               paymentData.card_name.length >= 2
      case 'bank_transfer':
        return paymentData.bank_account.length >= 5 && paymentData.bank_name.length >= 2
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border text-left transition-colors relative ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{method.name}</span>
                      {method.popular && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Payment Details Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Payment Details</h4>

        {/* Mobile Money Form */}
        {selectedMethod === 'mobile_money' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                {mobileProviders.map((provider) => (
                  <button
                    key={provider.value}
                    type="button"
                    onClick={() => handleInputChange('mobile_provider', provider.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      paymentData.mobile_provider === provider.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mx-auto mb-1 ${provider.color}`}></div>
                    <div className="text-sm font-medium">{provider.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile_number"
                value={paymentData.mobile_number}
                onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                placeholder="+231 XX XXX XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Card Form */}
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="card_name" className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                id="card_name"
                value={paymentData.card_name}
                onChange={(e) => handleInputChange('card_name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="card_number"
                value={paymentData.card_number}
                onChange={(e) => handleInputChange('card_number', e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card_expiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="card_expiry"
                  value={paymentData.card_expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4)
                    }
                    handleInputChange('card_expiry', value)
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label htmlFor="card_cvv" className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="card_cvv"
                  value={paymentData.card_cvv}
                  onChange={(e) => handleInputChange('card_cvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Form */}
        {selectedMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <select
                id="bank_name"
                value={paymentData.bank_name}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your bank</option>
                {liberianBanks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                id="bank_account"
                value={paymentData.bank_account}
                onChange={(e) => handleInputChange('bank_account', e.target.value)}
                placeholder="Your account number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Bank Transfer Instructions:</p>
                  <p>You will receive bank transfer details after confirming your order. Payment must be completed within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Campaign Total:</span>
          <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500">
          All prices are in USD. Payment will be processed securely.
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <div className="text-sm text-green-700">
            <span className="font-medium">Secure Payment:</span> Your payment information is encrypted and secure. We never store sensitive payment details.
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        type="button"
        onClick={processPayment}
        disabled={!isFormValid() || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <span>Complete Payment - ${totalPrice.toFixed(2)}</span>
        )}
      </button>
    </div>
  )
}

export default PaymentOptions