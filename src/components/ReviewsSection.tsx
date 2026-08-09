import React from 'react';
import { CUSTOMER_REVIEWS } from '../data/walletsData';
import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews-section" className="py-16 bg-zinc-950 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Pakistan Customer Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
            Trusted by Thousands Across Pakistan
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans">
            Read real feedback from buyers in Karachi, Lahore, Islamabad, Multan, and Peshawar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-zinc-900/90 rounded-2xl border border-amber-900/30 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans">{rev.date}</span>
                </div>

                <h4 className="font-serif font-bold text-base text-amber-200">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-100 flex items-center gap-1.5">
                    {rev.author}
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Buyer
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-zinc-400">{rev.city} • Purchased: {rev.productName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
