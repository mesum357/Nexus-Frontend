import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Shield, Users, CreditCard, Globe } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'

interface TermsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsPopup({ isOpen, onClose }: TermsPopupProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Terms & Policies</h2>
                  <p className="text-gray-600">Pakistan Online Platform Terms of Service</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* General Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                  General Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">1. Acceptance of Terms</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    By accessing and using Pakistan Online platform, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">2. Platform Usage</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    The platform provides services for creating online stores, educational institutes, hospitals, and marketplace listings. Users must comply with all applicable laws and regulations.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">3. User Responsibilities</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Data Collection</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, submit forms, or contact us for support.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">Data Usage</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your information is used to provide, maintain, and improve our services, communicate with you, and ensure platform security.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">Data Protection</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Payment Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Payment Requirements</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Creation of certain entities requires payment of specified fees. All fees are non-refundable and must be paid in Pakistani Rupees (PKR).
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Badge variant="secondary" className="mb-2">Shop Creation</Badge>
                      <p className="text-sm font-medium">PKR 5,000</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Badge variant="secondary" className="mb-2">Institute Creation</Badge>
                      <p className="text-sm font-medium">PKR 10,000</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Badge variant="secondary" className="mb-2">Hospital Creation</Badge>
                      <p className="text-sm font-medium">PKR 15,000</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Badge variant="secondary" className="mb-2">Marketplace Listing</Badge>
                      <p className="text-sm font-medium">PKR 2,000</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900">Payment Processing</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Payments are processed through bank transfers. Processing time is typically 24-48 hours. Users must provide valid transaction details for verification.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                  User Conduct & Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Prohibited Activities</h4>
                  <ul className="text-gray-700 text-sm leading-relaxed space-y-2">
                    <li>• Posting false, misleading, or fraudulent information</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Engaging in spam or unsolicited communications</li>
                    <li>• Attempting to gain unauthorized access to the platform</li>
                    <li>• Using the platform for illegal activities</li>
                  </ul>
                  
                  <h4 className="font-semibold text-gray-900">Content Guidelines</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    All content must be accurate, lawful, and appropriate. We reserve the right to remove content that violates our guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <X className="h-5 w-5 text-red-600" />
                  Account Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Termination Conditions</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We may terminate or suspend your account at any time for violations of these terms, fraudulent activity, or other misconduct.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">Appeal Process</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Users may appeal account termination by contacting our support team with relevant documentation and explanations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-blue-900 mb-2">Questions About Terms?</h4>
                <p className="text-blue-700 text-sm mb-4">
                  If you have any questions about these terms and policies, please contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <Button onClick={onClose} className="px-6">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
