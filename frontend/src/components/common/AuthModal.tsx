import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { X, Lock, Phone, User as UserIcon, Mail, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(identifier, password);
      } else {
        await register(fullName, phone, password, email || undefined);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoUser = (userType: 'customer' | 'seller' | 'salon' | 'admin') => {
    if (userType === 'customer') {
      setIdentifier('ananya@example.com');
      setPassword('mahilo123');
    } else if (userType === 'seller') {
      setIdentifier('saraswati@example.com');
      setPassword('mahilo123');
    } else if (userType === 'salon') {
      setIdentifier('anitha@example.com');
      setPassword('mahilo123');
    } else if (userType === 'admin') {
      setIdentifier('admin@mahilo.in');
      setPassword('mahilo123');
    }
    setIsLogin(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-gradient-to-b from-brand-bg to-white p-6 text-center relative border-b border-brand-border/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
          >
            <X size={18} />
          </button>
          
          <img
            src="/logo-square.jpg"
            alt="Mahilo Logo"
            className="w-24 h-24 object-contain mx-auto rounded-2xl shadow-xs"
          />

          <h2 className="text-xl font-extrabold text-brand-dark font-poppins mt-2">
            {isLogin ? 'Welcome Back' : 'Create Mahilo Account'}
          </h2>
          <p className="text-xs text-brand-secondary font-bold tracking-wider uppercase mt-0.5">
            Shop • Book • Learn • Empower
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-nunito">
              {error}
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="mb-5 p-3.5 bg-brand-bg rounded-2xl border border-brand-border">
            <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider block mb-2">
              ⚡ Instant Demo Profiles (Click to test roles)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoUser('customer')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-brand-border hover:border-brand-primary text-left text-gray-700 transition shadow-xs"
              >
                <div className="font-bold text-brand-primary">Ananya</div>
                <div className="text-[10px] text-gray-500">Customer</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('seller')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-brand-border hover:border-brand-primary text-left text-gray-700 transition shadow-xs"
              >
                <div className="font-bold text-brand-secondary">Saraswati Crafts</div>
                <div className="text-[10px] text-gray-500">Pottery Artisan</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('salon')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-brand-border hover:border-brand-primary text-left text-gray-700 transition shadow-xs"
              >
                <div className="font-bold text-brand-accent">Anitha Fashions</div>
                <div className="text-[10px] text-gray-500">Sarees & Apparels</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('admin')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-brand-border hover:border-brand-primary text-left text-gray-700 transition shadow-xs"
              >
                <div className="font-bold text-brand-growth">Rajeshwari</div>
                <div className="text-[10px] text-gray-500">Admin</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Radhika Verma"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="radhika@example.com"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile or Email</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter phone or email"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In to Mahilo' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs text-brand-primary font-bold hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
