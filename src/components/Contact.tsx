import React, { useState } from 'react';
import { X, Mail, MessageSquare, Github, Twitter, Send } from 'lucide-react';

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

const Contact: React.FC<ContactProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    window.location.href = `mailto:support@pathwordle.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-surface-container rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-surface-container-highest px-6 py-4 border-b border-surface-container-high flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-surface font-headline">Contact Us</h2>
            <p className="text-sm text-on-surface-variant">We'd love to hear from you!</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Methods */}
          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3">Get in Touch</h3>
            <div className="grid gap-3">
              <a href="mailto:support@pathwordle.com" className="flex items-center gap-3 bg-surface-container p-4 rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface">Email</h4>
                  <p className="text-sm text-on-surface-variant">support@pathwordle.com</p>
                </div>
              </a>

              <a href="https://twitter.com/PathWordleGame" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-surface-container p-4 rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Twitter className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface">Twitter</h4>
                  <p className="text-sm text-on-surface-variant">@PathWordleGame</p>
                </div>
              </a>

              <a href="https://github.com/pathwordle" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-surface-container p-4 rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="p-2 bg-tertiary/10 rounded-lg">
                  <Github className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface">GitHub</h4>
                  <p className="text-sm text-on-surface-variant">Open Source Code</p>
                </div>
              </a>
            </div>
          </section>

          {/* Contact Form */}
          <section>
            <h3 className="text-lg font-bold text-on-surface mb-3">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high rounded-lg border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-high rounded-lg border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-high rounded-lg border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-surface-container-high rounded-lg border border-surface-container-highest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary-dim transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </section>

          <section className="bg-surface-container-high p-4 rounded-lg text-center">
            <p className="text-sm text-on-surface-variant">
              We typically respond within 24-48 hours. For faster support, 
              check our <span className="text-primary font-medium">FAQ</span> or join our 
              <span className="text-secondary font-medium"> Discord community</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
