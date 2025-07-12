import React, { useState, useRef } from 'react'
import { Upload, Image, Type, Video, FileText, X, Eye, AlertCircle, Check } from 'lucide-react'

interface ContentUploaderProps {
  adType: 'banner' | 'text' | 'video'
  adContent: string
  adFileUrl?: string
  onAdTypeChange: (type: 'banner' | 'text' | 'video') => void
  onAdContentChange: (content: string) => void
  onAdFileChange: (file: File | null, url?: string) => void
}

const ContentUploader: React.FC<ContentUploaderProps> = ({
  adType,
  adContent,
  adFileUrl,
  onAdTypeChange,
  onAdContentChange,
  onAdFileChange
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const adTypeOptions = [
    {
      value: 'text' as const,
      label: 'Text Ad',
      icon: Type,
      description: 'Simple text-based promotional message (max 150 characters)',
      maxSize: null
    },
    {
      value: 'banner' as const,
      label: 'Banner Image',
      icon: Image,
      description: 'Upload an image banner (PNG/JPG, max 2MB)',
      maxSize: '2MB'
    },
    {
      value: 'video' as const,
      label: 'Video Ad',
      icon: Video,
      description: 'Upload a promotional video (MP4, 1-3 mins, max 20MB)',
      maxSize: '20MB'
    }
  ]

  const validateFile = (file: File): string | null => {
    if (adType === 'banner') {
      if (!file.type.startsWith('image/')) {
        return 'Please upload an image file (PNG, JPG, JPEG)'
      }
      if (file.size > 2 * 1024 * 1024) {
        return 'Image file must be smaller than 2MB'
      }
    } else if (adType === 'video') {
      if (!file.type.startsWith('video/')) {
        return 'Please upload a video file (MP4)'
      }
      if (file.size > 20 * 1024 * 1024) {
        return 'Video file must be smaller than 20MB'
      }
    }
    return null
  }

  const handleFileSelect = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file)
      onAdFileChange(file, tempUrl)
    } catch (error) {
      setUploadError('Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    onAdFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Ad Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Ad Format</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {adTypeOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onAdTypeChange(option.value)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  adType === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
                {option.maxSize && (
                  <div className="text-xs text-blue-600 mt-1">Max: {option.maxSize}</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Input Based on Type */}
      {adType === 'text' && (
        <div>
          <label htmlFor="adText" className="block text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 inline mr-2" />
            Ad Text Content
          </label>
          <textarea
            id="adText"
            value={adContent}
            onChange={(e) => onAdContentChange(e.target.value)}
            placeholder="Enter your promotional message here..."
            maxLength={150}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              Keep it short and engaging for maximum impact
            </div>
            <div className={`text-xs ${adContent.length > 130 ? 'text-red-500' : 'text-gray-500'}`}>
              {adContent.length}/150 characters
            </div>
          </div>
        </div>
      )}

      {/* File Upload for Banner/Video */}
      {(adType === 'banner' || adType === 'video') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {adType === 'banner' ? (
              <>
                <Image className="w-4 h-4 inline mr-2" />
                Upload Banner Image
              </>
            ) : (
              <>
                <Video className="w-4 h-4 inline mr-2" />
                Upload Video
              </>
            )}
          </label>

          {!adFileUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600 mb-2">
                Drop your {adType === 'banner' ? 'image' : 'video'} here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {adType === 'banner' 
                  ? 'PNG, JPG up to 2MB' 
                  : 'MP4 up to 20MB, 1-3 minutes recommended'}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={adType === 'banner' ? 'image/*' : 'video/*'}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {adType === 'banner' ? (
                    <img
                      src={adFileUrl}
                      alt="Ad preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={adFileUrl}
                      className="w-16 h-16 object-cover rounded"
                      controls={false}
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {adType === 'banner' ? 'Image uploaded' : 'Video uploaded'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ready for campaign
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">File validated</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Optional Description for File Uploads */}
      {(adType === 'banner' || adType === 'video') && (
        <div>
          <label htmlFor="adDescription" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Ad Description (Optional)
          </label>
          <textarea
            id="adDescription"
            value={adContent}
            onChange={(e) => onAdContentChange(e.target.value)}
            placeholder="Add a brief description or call-to-action text..."
            maxLength={150}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              This text will appear alongside your {adType === 'banner' ? 'image' : 'video'}
            </div>
            <div className={`text-xs ${adContent.length > 130 ? 'text-red-500' : 'text-gray-500'}`}>
              {adContent.length}/150 characters
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Live Preview</h4>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">How your ad will appear in the directory:</div>
          
          <div className="bg-white rounded border border-gray-200 p-3">
            {adType === 'text' && (
              <div className="text-sm">
                {adContent || 'Your promotional text will appear here...'}
              </div>
            )}
            
            {adType === 'banner' && (
              <div className="space-y-2">
                {adFileUrl ? (
                  <img src={adFileUrl} alt="Ad banner" className="max-w-full h-auto rounded" />
                ) : (
                  <div className="bg-gray-100 h-32 rounded flex items-center justify-center text-gray-500">
                    Banner image will appear here
                  </div>
                )}
                {adContent && (
                  <div className="text-sm text-gray-700">{adContent}</div>
                )}
              </div>
            )}
            
            {adType === 'video' && (
              <div className="space-y-2">
                {adFileUrl ? (
                  <video src={adFileUrl} controls className="max-w-full h-auto rounded" />
                ) : (
                  <div className="bg-gray-100 h-32 rounded flex items-center justify-center text-gray-500">
                    Video will appear here
                  </div>
                )}
                {adContent && (
                  <div className="text-sm text-gray-700">{adContent}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentUploader