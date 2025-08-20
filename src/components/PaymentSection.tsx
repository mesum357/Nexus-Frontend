import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle,
  AlertCircle,
  Info,
  Upload,
  X
} from 'lucide-react'

interface PaymentSectionProps {
  entityType: 'shop' | 'institute' | 'hospital' | 'marketplace'
  onPaymentComplete?: (paymentData: any) => void
  isRequired?: boolean
  isSubmitting?: boolean
}

interface PaymentData {
  transactionScreenshot: File | null
}

export default function PaymentSection({ 
  entityType, 
  onPaymentComplete, 
  isRequired = true,
  isSubmitting = false
}: PaymentSectionProps) {
  const { toast } = useToast()
  const [paymentData, setPaymentData] = useState<PaymentData>({
    transactionScreenshot: null
  })
  const [loading, setLoading] = useState(true)
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchCode: '',
    swiftCode: '',
    qrCodeImage: '',
    paymentAmounts: {
      shop: 5000,
      institute: 10000,
      hospital: 15000,
      marketplace: 2000
    }
  })

  // Fetch payment settings on component mount
  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/settings`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBankDetails(data.settings)
      } else {
        console.error('Failed to fetch payment settings')
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (file: File | null) => {
    setPaymentData(prev => ({ ...prev, transactionScreenshot: file }))
  }

  const handleSubmitPayment = async () => {
    // Validation
    if (!paymentData.transactionScreenshot) {
      toast({ 
        title: 'Screenshot Required', 
        description: 'Please upload a screenshot of your transaction', 
        variant: 'destructive' 
      })
      return
    }

    // Call the callback if provided - this will handle the entity creation and payment
    if (onPaymentComplete) {
      onPaymentComplete(paymentData)
    }

    // Reset form after successful submission
    setPaymentData({
      transactionScreenshot: null
    })
  }

  const getEntityDisplayName = () => {
    switch (entityType) {
      case 'shop': return 'Shop'
      case 'institute': return 'Institute'
      case 'hospital': return 'Hospital'
      case 'marketplace': return 'Marketplace Listing'
      default: return 'Entity'
    }
  }

  const getPaymentAmount = () => {
    return bankDetails.paymentAmounts[entityType] || 5000
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Payment Section</h2>
        </div>
        <p className="text-muted-foreground">
          Complete payment to finalize your {getEntityDisplayName().toLowerCase()} creation
        </p>
        {isRequired && (
          <Badge variant="destructive" className="text-sm">
            Payment Required
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Bank Details & QR Code */}
        <div className="space-y-6">
          {/* Bank Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Bank Name:</span>
                  <span className="text-muted-foreground">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Account Title:</span>
                  <span className="text-muted-foreground">{bankDetails.accountTitle}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Account Number:</span>
                  <span className="text-muted-foreground font-mono">{bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">IBAN:</span>
                  <span className="text-muted-foreground font-mono text-xs">{bankDetails.iban}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Branch Code:</span>
                  <span className="text-muted-foreground">{bankDetails.branchCode}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">SWIFT Code:</span>
                  <span className="text-muted-foreground">{bankDetails.swiftCode}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-5 w-5" />
                QR Code for Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {bankDetails.qrCodeImage ? (
                <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <img 
                    src={bankDetails.qrCodeImage} 
                    alt="QR Code for Payment" 
                    className="h-32 w-32 mx-auto object-contain"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Scan to get bank details
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground mt-2">
                    QR Code not configured
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {bankDetails.qrCodeImage 
                  ? 'Scan the QR code above to get bank details'
                  : 'Admin needs to upload a QR code image in the admin panel'
                }
              </p>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Required Amount</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  PKR {getPaymentAmount().toLocaleString()}
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  One-time fee for {getEntityDisplayName().toLowerCase()} creation
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Important Notes</span>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Payment processing takes 24-48 hours</li>
                  <li>• Keep your transaction receipt for verification</li>
                  <li>• Contact support if payment issues arise</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Screenshot Upload Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              Upload Transaction Screenshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please upload a screenshot of your bank transaction showing the payment to our account.
              </p>
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {paymentData.transactionScreenshot ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">File Selected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paymentData.transactionScreenshot.name}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileChange(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileChange(file)
                        }
                        input.click()
                      }}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmitPayment}
              disabled={isSubmitting || !paymentData.transactionScreenshot}
              className="w-full"
              size="lg"
            >
                             {isSubmitting ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                   Creating {getEntityDisplayName()} & Submitting Payment...
                 </>
               ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Payment Request
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our payment terms and conditions
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
