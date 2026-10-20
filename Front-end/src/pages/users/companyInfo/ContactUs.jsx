import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
} from 'lucide-react';

export default function ContactUs() {
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
        <div className="grid grid-cols-1 gap-8 items-start mb-16">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
              <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Get in Touch
              </h2>

              {/* Info Item 1: Email */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Email Us</h3>
                  <p className="text-xs text-stone-500 mt-0.5">For order & support inquiries</p>
                  <a href="mailto:support@sarimasupermart.com" className="text-sm font-medium text-stone-800 hover:underline mt-1 block">
                    support@sarimasupermart.com
                  </a>
                </div>
              </div>

              {/* Info Item 2: Phone */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Call Us</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Mon–Fri from 9am to 6pm</p>
                  <a href="tel:+15550192834" className="text-sm font-medium text-stone-800 hover:underline mt-1 block">
                    Coming soon
                  </a>
                </div>
              </div>

              {/* Info Item 3: Address */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Headquarters</h3>
                  <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                   IS building B, Kashiwa 1-11-37 Honjo shi,<br />Saitama Prefecture, Japan
                  </p>
                </div>
              </div>

              {/* Info Item 4: Hours */}
              <div className="flex flex-col items-center gap-3">
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
                <div className="flex justify-center gap-3">
                  {/* Facebook SVG */}
                  <a href="https://www.facebook.com/p/Sarima-Super-Mart-61595034998336/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="Facebook">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a href="https://www.instagram.com/sarimasupermartjb/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="Instagram">
                    <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a href="https://www.tiktok.com/@sarimasupermart" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition" aria-label="TikTok">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.33V2h-3.45v13.67a2.9 2.9 0 0 1-2.9 2.76 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6.05.88.14V9.25a6.4 6.4 0 0 0-.88-.06A6.35 6.35 0 0 0 3.12 15.54a6.35 6.35 0 0 0 6.35 6.35 6.35 6.35 0 0 0 6.35-6.35V8.58a8.2 8.2 0 0 0 4.8 1.54V6.67a4.8 4.8 0 0 1-1.03.02Z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>


        </div>

      </div>
    </div>
  );
}