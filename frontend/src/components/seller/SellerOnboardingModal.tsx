import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { X, Store, CheckCircle, AlertCircle, Building, Landmark } from 'lucide-react';

interface SellerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellerOnboardingModal: React.FC<SellerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUser } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('HOME_BASED');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [bankAccountName, setBankAccountName] = useState(user?.fullName || '');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or register first to apply as a Mahilo seller.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res: any = await api.post('/sellers/apply', {
        businessName,
        businessType,
        description,
        city,
        state,
        panNumber: panNumber || undefined,
        gstin: gstin || undefined,
        bankAccountNumber: bankAccountNumber || undefined,
        bankIfscCode: bankIfscCode || undefined,
        bankAccountName: bankAccountName || undefined,
        bankName: bankName || undefined,
      });

      if (res.success) {
        setIsComplete(true);
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit seller application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-poppins">
                Grow Your Business on Mahilo
              </h2>
              <p className="text-xs text-white/90 font-nunito">
                Women Entrepreneurs Products & Services Storefront
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {isComplete ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-growth/10 text-brand-growth flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-poppins">
              Application Under Review!
            </h3>
            <p className="text-xs text-gray-600 font-nunito max-w-sm mx-auto leading-relaxed">
              Thank you for registering your business with Mahilo. Our administrator team will review your business credentials and notify you once approved.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-dark transition"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">Business / Storefront Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Maya Handcrafted Terracotta & Pottery"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Business Entity Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="INDIVIDUAL_ARTISAN">Individual Artisan / Home Creator</option>
                <option value="HOME_BASED">Home-Based Business / Salon</option>
                <option value="REGISTERED_SOLE_PROPRIETOR">Registered Sole Proprietorship</option>
                <option value="SELF_HELP_GROUP">Self Help Group (SHG) / Cooperative</option>
                <option value="PARTNERSHIP">Partnership Firm</option>
                <option value="PRIVATE_LIMITED">Private Limited Company</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Storefront Description & Story</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your craft, services offered, background, or workshop specialty..."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Bank details for settlements */}
            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-2.5">
              <span className="font-bold text-brand-primary flex items-center gap-1.5">
                <Landmark size={14} />
                <span>Bank Account for Direct Sales Settlements</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Bank Account Number"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                />
                <input
                  type="text"
                  value={bankIfscCode}
                  onChange={(e) => setBankIfscCode(e.target.value)}
                  placeholder="IFSC Code (e.g. HDFC0001234)"
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Onboarding Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
