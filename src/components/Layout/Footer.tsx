import React from 'react'
import { Heart, Shield, Mail, Phone } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-ek-bg-main border-t border-ek-accent-gold/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.svg" alt="Everlasting Kin" className="h-8 w-auto" />
            </div>
            <p className="text-ek-text-muted text-sm leading-relaxed mb-4">
              Connecting lost loved ones with their families through dignity, respect, and advanced technology. 
              Supporting mortuary staff, police departments, and families in their most difficult moments.
            </p>
            <div className="flex items-center space-x-2 text-ek-accent-mint text-sm">
              <Heart className="w-4 h-4" />
              <span>Serving with compassion since 2024</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-ek-text-main font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-ek-text-muted">
              <li>Family Search</li>
              <li>Record Management</li>
              <li>Professional Support</li>
              <li>Secure Communication</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-ek-text-main font-semibold mb-4">Support</h3>
            <div className="space-y-3 text-sm text-ek-text-muted">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-ek-accent-gold" />
                <span>support@everlastingkin.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-ek-accent-gold" />
                <span>24/7 Emergency Line</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-ek-accent-mint" />
                <span>Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-ek-accent-gold/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-ek-text-muted text-sm">
            © 2024 Everlasting Kin. All rights reserved. Handling sensitive information with care.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-sm text-ek-text-muted">
            <a href="#" className="hover:text-ek-accent-mint transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ek-accent-mint transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ek-accent-mint transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer