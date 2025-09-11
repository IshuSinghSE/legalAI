import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Twitter, Linkedin, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const footerLinks = {
    product: [
      { label: "Features", value: "features" },
      { label: "How It Works", value: "how-it-works" },
      { label: "Pricing", value: "pricing" },
      { label: "API Documentation", value: "api" }
    ],
    company: [
      { label: "About Us", value: "about" },
      { label: "Contact", value: "contact" },
      { label: "Careers", value: "careers" },
      { label: "Blog", value: "blog" }
    ],
    legal: [
      { label: "Privacy Policy", value: "privacy" },
      { label: "Terms & Conditions", value: "terms" },
      { label: "Cookie Policy", value: "cookies" },
      { label: "GDPR Compliance", value: "gdpr" }
    ],
    support: [
      { label: "Help Center", value: "help" },
      { label: "Contact Support", value: "support" },
      { label: "System Status", value: "status" },
      { label: "Security", value: "security" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-400">
                Get the latest updates on new features, legal insights, and AI technology directly to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-bold text-xl">LegalAI</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Making legal knowledge accessible to everyone through advanced AI technology. 
              Transform complex legal documents into clear, actionable guidance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>hello@legalai.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold mb-6">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => onPageChange(link.value)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => onPageChange(link.value)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => onPageChange(link.value)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => onPageChange(link.value)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <div>© 2024 LegalAI. All rights reserved.</div>
              <div>|</div>
              <div>
                Created by{" "}
                <button
                  onClick={() => onPageChange("team")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  CodeSquad
                </button>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}