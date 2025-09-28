import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, FileText, Lock, AlertTriangle, Mail, MapPin, Copyright } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TermsAndPoliciesProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  title?: string
}

export default function TermsAndPolicies({ 
  isOpen, 
  onClose, 
  onAccept, 
  title = "Terms & Policies" 
}: TermsAndPoliciesProps) {
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center text-primary mb-2">
            Privacy Policy & Terms of Service
          </DialogTitle>
          <p className="text-center text-muted-foreground mb-6">
            Pakistan Online
          </p>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Introduction */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-100">
              Welcome to E دنیا, your city's all-in-one digital hub for shopping, learning, healthcare, and community engagement.
By creating a store, education center, hospital profile, or any other service on E دنیا, you agree to the following terms and policies.
            </p>
          </div>

          {/* Section 1: Information Collection & Usage */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Information Collection & Usage
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span>We collect personal details (name, email, phone number, CNIC if required) to verify accounts and ensure a safe marketplace.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span>Business/store owners may be required to provide business information for compliance purposes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span>User data is used only for service improvement, communication, and security.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span>We do not sell or share your personal information with third parties without consent, except where legally required.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Account Creation & Services */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  Account Creation & Services
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span>Any user creating a Store, Education Profile, Hospital Listing, or Service Page must provide accurate and verifiable information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span>Account creation charges are <strong className="text-foreground">PKR 200 (non-refundable)</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span>Once paid, the service fee is not refundable under any circumstances.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span>By registering, the user agrees that they will not hold Pakistan Online liable for any disputes, losses, or damages.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Refund & Cancellation Policy */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Refund & Cancellation Policy
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>All payments made for creating stores, education hubs, hospitals, or any other services on Pakistan Online are <strong className="text-foreground">non-refundable</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>Users acknowledge and agree that they have no right to claim refunds once the service is activated.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>Users also agree that they cannot pursue any legal action against Pakistan Online regarding refunds, payments, or service termination.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: User Responsibilities */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  User Responsibilities
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">•</span>
                    <span>Users must ensure that all content (products, courses, hospital services, posts) complies with local laws of Pakistan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">•</span>
                    <span>Selling illegal, prohibited, or harmful products/services is strictly forbidden.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">•</span>
                    <span>Misuse of the platform may result in account suspension or permanent ban without refund.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Data Security */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">5</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-600" />
                  Data Security
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Pakistan Online uses standard security measures to protect user data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>However, Pakistan Online cannot guarantee 100% security against unauthorized access, and users share data at their own risk.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">6</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-indigo-600" />
                  Limitation of Liability
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">•</span>
                    <span>Pakistan Online provides only a digital platform. We are not responsible for the quality, accuracy, or delivery of goods, services, or courses offered by third-party vendors or individuals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">•</span>
                    <span>All transactions and communications are strictly between users and vendors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">•</span>
                    <span>Pakistan Online shall not be liable for any loss, damage, fraud, or dispute arising between buyers, sellers, students, or service providers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Modification of Terms */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">7</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  Modification of Terms
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400">•</span>
                    <span>Pakistan Online reserves the right to update or modify these terms at any time without prior notice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400">•</span>
                    <span>Continued use of the platform after changes means you agree to the updated policy.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Contact Information */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <span className="text-pink-600 dark:text-pink-400 font-bold text-sm">8</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-600" />
                  Contact Information
                </h3>
                <p className="text-muted-foreground mb-3">
                  For any questions regarding this policy, contact us at:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-pink-600" />
                    <span className="font-medium">infoedunia@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-pink-600" />
                    <span>Manchester Tower Lahore</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Copyright className="h-4 w-4" />
              <span>2025 Pakistan Online. All rights reserved.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            I Accept Terms & Conditions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
