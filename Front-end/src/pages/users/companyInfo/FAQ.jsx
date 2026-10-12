import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What areas do you deliver to?",
    a: "We currently deliver to selected areas around our service locations. Enter your delivery address at checkout to check whether delivery is available in your area.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders are delivered within 1–2 business days. Delivery time may vary depending on your location, order volume, and product availability.",
  },
  {
    q: "How much is the delivery charge?",
    a: "Delivery charges may vary depending on your delivery location and order size. The applicable delivery fee will be shown clearly during checkout before you place your order.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "You can request to cancel or modify your order before it has been processed for delivery. Please contact our customer support as soon as possible.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept the payment methods available at checkout. Available options may vary depending on your location and current payment service availability.",
  },
  {
    q: "What should I do if I receive a damaged or incorrect product?",
    a: "Please contact our customer support as soon as possible and provide your order details and photos of the damaged or incorrect item. We will review the issue and help arrange a replacement or refund when applicable.",
  },
  {
    q: "Can I return a product after delivery?",
    a: "Yes, eligible products can be returned according to our return policy. Products should generally be unused and in their original condition. Some perishable or opened items may not be eligible for return.",
  },
  {
    q: "What happens if a product is out of stock?",
    a: "If an ordered product becomes unavailable, we may contact you regarding a suitable replacement or refund the amount for that item, depending on your preference and availability.",
  },
  {
    q: "Can I order fresh food and grocery items online?",
    a: "Yes. You can browse our available grocery, fresh food, beverages, and household products online and add them to your cart for delivery.",
  },
  {
    q: "How can I track my order?",
    a: "You can check your order status from your profile under 'My Orders'. If tracking information is available, it will also be provided through the order details.",
  },
  {
    q: "Can I order products in different quantities or sizes?",
    a: "Yes. Many products are available in different sizes or variants. Select your preferred size or variant and quantity before adding the product to your cart.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can contact our customer support through the Contact Us page on our website. Please include your order number when contacting us about an existing order.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <span className="rounded-full bg-stone-200/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-500">
            Help & Support
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-stone-600 sm:text-base">
            Quick answers to common questions about shopping, orders, and delivery.
          </p>
        </header>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <section
              key={faq.q}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white transition"
            >
              <button
                type="button"
                aria-expanded={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-stone-400 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === index && (
                <p className="border-t border-stone-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-stone-600">
                  {faq.a}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
