import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg mr-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  LegalPro
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg max-w-md">
                Revolutionizing legal document analysis with AI-powered insights, 
                enterprise-grade security, and intuitive collaboration tools.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Github, href: "#", label: "GitHub" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                    whileHover={{ y: -3 }}
                  >
                    <social.icon className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Product</h3>
            <div className="space-y-4">
              {[
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                { name: "Security", href: "#security" },
                { name: "Integrations", href: "#integrations" },
                { name: "API Docs", href: "#api" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Company</h3>
            <div className="space-y-4">
              {[
                { name: "About Us", href: "#about" },
                { name: "Careers", href: "#careers" },
                { name: "Blog", href: "#blog" },
                { name: "Press", href: "#press" },
                { name: "Contact", href: "#contact" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:mx-0">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get the latest updates on new features and legal tech insights.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-center lg:text-left mb-4 lg:mb-0">
            © 2025 LegalPro. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-end gap-8">
            <a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a>
            <a href="#security" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</a>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Enhanced for light mode */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
      </div>
    </footer>
  );
}
