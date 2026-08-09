import React, { useState } from 'react';
import { WalletProduct, CustomerReview } from '../types';
import { PAKISTAN_CITIES, CUSTOMER_REVIEWS } from '../data/walletsData';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Check, 
  Star, 
  ShoppingBag, 
  MessageSquare,
  ThumbsUp,
  UserCheck,
  PlusCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: WalletProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: WalletProduct,
    selectedColor: { name: string; hex: string; image: string },
    customInitials?: string,
    foilType?: any,
    isGiftWrapped?: boolean
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(selectedColor.image || product.images[0]);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'reviews' | 'packaging'>('reviews');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Filter reviews matching current product, fallback to related reviews
  const matchingReviews = CUSTOMER_REVIEWS.filter(
    (r) => r.productId === product.id || r.productName === product.name
  );
  const productReviews = matchingReviews.length > 0 ? matchingReviews : CUSTOMER_REVIEWS;

  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(productReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Delivery estimation logic
  const getDeliveryEstimate = (city: string) => {
    const c = city.toLowerCase();
    if (c === 'karachi' || c === 'lahore' || c === 'islamabad' || c === 'rawalpindi') {
      return { days: '1 - 2 Business Days', courier: 'TCS Express / Leopards COD' };
    }
    return { days: '2 - 3 Business Days', courier: 'M&P / TCS Nationwide COD' };
  };

  const deliveryInfo = getDeliveryEstimate(selectedCity);

  const handleAdd = () => {
    onAddToCart(
      product,
      selectedColor,
      undefined,
      undefined,
      isGiftWrapped
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: CustomerReview = {
      id: `custom-rev-${Date.now()}`,
      author: newAuthor.trim(),
      city: newCity,
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim() || 'Excellent Product Quality!',
      comment: newComment.trim(),
      productName: product.name,
      productId: product.id,
      verifiedPurchase: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSuccess(true);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-800/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-amber-50 shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-400 hover:text-amber-300 border border-amber-800/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Stage */}
            <div className="relative aspect-square bg-zinc-950 rounded-xl overflow-hidden border border-amber-900/30 group">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* RFID Shield Badge */}
              {product.hasRfidProtection && (
                <div className="absolute top-3 left-3 bg-zinc-950/90 border border-amber-700/40 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>13.56 MHz RFID Shield</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-amber-400 scale-105' : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Purchase Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-amber-300">{product.leatherType}</span>
              </div>

              <h2 className="font-serif text-2xl lg:text-3xl font-extrabold text-amber-100">
                {product.name}
              </h2>

              {/* Rating Header Clickable */}
              <button 
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-2 text-xs text-amber-400 mt-2 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-amber-200">{product.rating}</span>
                <span className="text-amber-400/90 underline font-medium">({product.reviewsCount} verified customer reviews)</span>
              </button>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-serif font-extrabold text-3xl text-amber-300">
                  Rs. {product.price.toLocaleString('en-PK')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    Rs. {product.originalPrice.toLocaleString('en-PK')}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/50">
                  In Stock • Cash on Delivery
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
                Select Leather Shade: <span className="text-amber-400 font-normal">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColor(col);
                      if (col.image) setSelectedImage(col.image);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      selectedColor.name === col.name
                        ? 'bg-amber-950/80 text-amber-200 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-amber-800'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pakistan City COD Delivery Checker */}
            <div className="bg-zinc-950/90 p-3.5 rounded-xl border border-amber-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  Cash on Delivery Estimator
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-zinc-900 text-amber-300 border border-amber-800/40 rounded px-2.5 py-1 text-xs focus:outline-none font-medium"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
                <span>Shipping Carrier: <strong className="text-amber-200">{deliveryInfo.courier}</strong></span>
                <span>Delivery: <strong className="text-emerald-400">{deliveryInfo.days}</strong></span>
              </div>
            </div>

            {/* Gift Wrap Checkbox Option */}
            <label className="flex items-center gap-2 cursor-pointer bg-amber-950/30 p-3 rounded-lg border border-amber-800/30 text-xs">
              <input
                type="checkbox"
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <Gift className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-200">
                Add Premium Matte Gift Box & Velvet Ribbon Packaging (<strong className="text-amber-400">+ Rs. 350</strong>)
              </span>
            </label>

            {/* Add to Cart CTA */}
            <div className="space-y-2 pt-2">
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAdd}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 shadow-amber-950/60 border border-amber-300'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-zinc-950" />
                    <span>Add to Bag • Order Cash on Delivery</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-zinc-400 font-sans">
                🔒 100% Risk-Free: Inspect package before paying courier in Pakistan
              </p>
            </div>

            {/* Tabs for Tech Specs & Reviews */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-4 text-xs font-semibold border-b border-zinc-800 pb-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 flex items-center gap-1.5 ${activeTab === 'reviews' ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-400 hover:text-amber-200'}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Customer Reviews ({reviewsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`pb-1 ${activeTab === 'features' ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-400 hover:text-amber-200'}`}
                >
                  Craft Features
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 ${activeTab === 'specs' ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-400 hover:text-amber-200'}`}
                >
                  Technical Specs
                </button>
                <button
                  onClick={() => setActiveTab('packaging')}
                  className={`pb-1 ${activeTab === 'packaging' ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-zinc-400 hover:text-amber-200'}`}
                >
                  Unboxing Box
                </button>
              </div>

              <div className="pt-4 text-xs text-zinc-300 space-y-3 font-sans leading-relaxed">
                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-amber-900/30">
                      <div>
                        <div className="font-bold text-amber-200 flex items-center gap-2">
                          <span className="text-lg">{product.rating}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[11px] text-zinc-400">Based on verified customer orders in Pakistan</span>
                      </div>

                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 font-semibold text-xs border border-amber-700/50 flex items-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
                      </button>
                    </div>

                    {/* Write Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleSubmitReview} className="bg-zinc-950 p-4 rounded-xl border border-amber-700/50 space-y-3">
                        <h4 className="font-bold text-amber-200 text-xs uppercase tracking-wider">Submit Product Feedback</h4>
                        
                        {reviewSuccess ? (
                          <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Thank you! Your verified review has been submitted and published.</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] text-zinc-400 block mb-1">Your Name *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Usman Chaudhry"
                                  value={newAuthor}
                                  onChange={(e) => setNewAuthor(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-zinc-400 block mb-1">City in Pakistan</label>
                                <select
                                  value={newCity}
                                  onChange={(e) => setNewCity(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                                >
                                  {PAKISTAN_CITIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-zinc-400 block mb-1">Rating</label>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className="p-1"
                                  >
                                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-zinc-400 block mb-1">Review Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Outstanding leather quality and fast TCS delivery"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-zinc-400 block mb-1">Review Comments *</label>
                              <textarea
                                required
                                rows={3}
                                placeholder="Share details about leather feel, stitching, PKR note capacity, packaging, or COD experience..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded uppercase tracking-wider transition-colors"
                            >
                              Post Verified Review
                            </button>
                          </>
                        )}
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {reviewsList.map((rev) => (
                        <div key={rev.id} className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-200 text-xs">{rev.author}</span>
                              <span className="text-[10px] text-zinc-500">• {rev.city}</span>
                              {rev.verifiedPurchase && (
                                <span className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 font-semibold">
                                  <UserCheck className="w-2.5 h-2.5" /> Verified Order
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                              />
                            ))}
                            <span className="text-xs font-bold text-amber-100 ml-2">{rev.title}</span>
                          </div>

                          <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-zinc-500">Leather:</span> {product.leatherType}</div>
                    <div><span className="text-zinc-500">Dimensions:</span> {product.dimensions}</div>
                    <div><span className="text-zinc-500">Capacity:</span> {product.cardCapacity}</div>
                    <div><span className="text-zinc-500">RFID Shield:</span> 13.56 MHz Active</div>
                  </div>
                )}

                {activeTab === 'packaging' && (
                  <p className="text-zinc-400">
                    Delivered in a sleek matte-black presentation box with satin pull ribbon, authenticity warranty card, and soft velvet dust pouch.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

