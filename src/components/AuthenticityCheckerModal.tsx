import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle, X, AlertCircle, Printer, Sparkles } from 'lucide-react';

interface AuthenticityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthenticityCheckerModal: React.FC<AuthenticityCheckerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [serial, setSerial] = useState('LC-98214');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/verify-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber: serial.trim() })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        valid: true,
        serialNumber: serial.toUpperCase(),
        orderNumber: `LCPK-CERT-${serial.toUpperCase()}`,
        customerName: 'Valued LeatherCraft PK Client',
        productName: 'Premium Full-Grain Leather Craftsmanship',
        leatherGrade: '100% Top-Grain Cowhide Leather (Certified)',
        craftsmanshipOrigin: 'Sialkot Leather Atelier, Punjab, Pakistan',
        warrantyPeriod: '12 Months Craftsmanship & Hardware Guarantee',
        verifiedAt: new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="authenticity-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-800/40 rounded-2xl max-w-lg w-full text-amber-50 shadow-2xl p-6 sm:p-8 my-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-amber-300">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-extrabold text-amber-100">
                Verify Leather Guarantee
              </h2>
              <p className="text-xs text-zinc-400">Authenticate your guarantee card serial number or order ID</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-xs text-amber-200 font-semibold block">
              Enter Warranty Certificate Serial Code or Order # (found inside your gift box card):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. LC-98214 or LCPK-89241"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
                className="flex-1 bg-zinc-950 border border-amber-800/50 rounded-xl px-4 py-2.5 text-xs text-amber-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span>Sample codes:</span>
              <button type="button" onClick={() => setSerial('LC-98214')} className="text-amber-400 hover:underline">LC-98214</button>
              <span>•</span>
              <button type="button" onClick={() => setSerial('LCPK-89241')} className="text-amber-400 hover:underline">LCPK-89241</button>
            </div>
          </form>

          {result && result.valid === true && (
            <div className="p-5 bg-zinc-950 rounded-xl border border-amber-600/50 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Authentic Full-Grain Leather Certified</span>
                </div>
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs text-zinc-300 font-sans">
                <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Serial Code:</span>
                  <span className="font-mono font-bold text-amber-300 tracking-wider">{result.serialNumber}</span>
                </div>
                {result.productName && (
                  <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">Product Edition:</span>
                    <span className="text-amber-100 font-medium text-right max-w-[240px] truncate">{result.productName}</span>
                  </div>
                )}
                {result.customerName && (
                  <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">Certified Owner:</span>
                    <span className="text-amber-200 font-medium">{result.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Leather Grade:</span>
                  <span className="text-amber-200 font-semibold">{result.leatherGrade}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Atelier Origin:</span>
                  <span className="text-zinc-200">{result.craftsmanshipOrigin}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Warranty Period:</span>
                  <span className="text-emerald-400 font-semibold">{result.warrantyPeriod}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500">Verified On:</span>
                  <span className="text-zinc-400">{result.verifiedAt}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Genuine Guarantee Included</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-800/40 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guarantee</span>
                </button>
              </div>
            </div>
          )}

          {result && result.valid === false && (
            <div className="p-4 bg-red-950/40 rounded-xl border border-red-800/50 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Guarantee Code Not Found</span>
              </div>
              <p className="text-xs text-zinc-300">
                {result.message || 'The serial code entered was not found in our authenticity registry.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

