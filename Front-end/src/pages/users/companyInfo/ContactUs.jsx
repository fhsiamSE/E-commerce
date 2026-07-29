import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

const faqs = [
  {
    q: "How long will it take to get a response?",
    a: "Our customer support team typically responds within 24 hours on business days."
  },
  {
    q: "How can I track my order status?",
    a: "You can track your order directly from your profile account under 'My Orders' or use the tracking link sent in your shipping email."
  },
  {
    q: "What is your return and refund policy?",
    a: "We offer a 30-day hassle-free return policy. Items must be in original condition with tags attached."
  }
];

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500 bg-stone-200/60 px-3 py-1 rounded-full">
            Help & Support
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            Have a question about an order, product, or return? Reach out to our friendly team and we will get back to you as soon as possible.
          </p>
        </div>

        {/* Main Content: Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Get in Touch
              </h2>

              {/* Info Item 1: Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Email Us</h3>
                  <p className="text-xs text-stone-500 mt-0.5">For order & support inquiries</p>
                  <a href="mailto:support@example.com" className="text-sm font-medium text-stone-800 hover:underline mt-1 block">
                    support@example.com
                  </a>
                </div>
              </div>

              {/* Info Item 2: Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Call Us</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Mon–Fri from 9am to 6pm</p>
                  <a href="tel:+15550192834" className="text-sm font-medium text-stone-800 hover:underline mt-1 block">
                    +1 (555) 019-2834
                  </a>
                </div>
              </div>

              {/* Info Item 3: Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Headquarters</h3>
                  <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                    123 Commerce Avenue, Suite 500<br />New York, NY 10001
                  </p>
                </div>
              </div>

              {/* Info Item 4: Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Working Hours</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Monday - Friday: 9am - 6pm EST</p>
                  <p className="text-xs text-stone-600">Saturday - Sunday: Closed</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {/* Instagram */}
                  {/* <a href="#" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="Instagram">
                    <Instagram size={18} />
                  </a> */}

                  {/* Facebook SVG */}
                  <a href="#" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="Facebook">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* X / Twitter SVG */}
                  <a href="#" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="Twitter">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-2">Send us a message</h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Fill out the form below and we'll reply as soon as possible.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-6 text-center my-8">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2" />
                  <h3 className="font-bold text-base">Message Sent Successfully!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you for reaching out. A team member will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-900 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-900 transition bg-white"
                    >
                      <option value="Order Inquiry">Order Status & Tracking</option>
                      <option value="Returns & Refunds">Returns & Refunds</option>
                      <option value="Product Question">Product Info & Sizing</option>
                      <option value="Other">General / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-900 transition resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-stone-800 transition shadow-sm"
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section: Quick FAQ Accordion */}
        <div className="max-w-3xl mx-auto border-t border-stone-200 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-900">Frequently Asked Questions</h2>
            <p className="text-xs text-stone-500 mt-1">Quick answers to common questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-sm text-stone-900 hover:bg-stone-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-200 text-stone-400 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}