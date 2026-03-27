import React, { useState } from 'react';
import { FileText, Scale, Info, Mail, Heart, Github, Twitter } from 'lucide-react';

interface FooterProps {
  onShowPrivacy: () => void;
  onShowTerms: () => void;
  onShowAbout: () => void;
  onShowContact: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onShowPrivacy,
  onShowTerms,
  onShowAbout,
  onShowContact
}) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { icon: FileText, label: 'Privacy Policy', onClick: onShowPrivacy },
    { icon: Scale, label: 'Terms of Service', onClick: onShowTerms },
    { icon: Info, label: 'About', onClick: onShowAbout },
    { icon: Mail, label: 'Contact', onClick: onShowContact },
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/PathWordleGame', color: 'text-secondary' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/pathwordle', color: 'text-tertiary' },
  ];

  return (
    <footer className="bg-surface-container-low border-t border-surface-container-high mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-3 font-headline">PathWordle</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              A free strategic word puzzle game. Connect letters, build paths, and guess hidden words. 
              Train your brain daily!
            </p>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-error fill-error" />
              <span>by Luminous Logic</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wide">Quick Links</h3>
            <div className="space-y-2">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={link.onClick}
                    className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors w-full text-left"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wide">Connect</h3>
            <div className="space-y-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors ${link.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              <a
                href="mailto:support@pathwordle.com"
                className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@pathwordle.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-container-high">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-on-surface-variant">
              © {currentYear} PathWordle. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <span>Free to play</span>
              <span>•</span>
              <span>No ads</span>
              <span>•</span>
              <span>No sign-up required</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
