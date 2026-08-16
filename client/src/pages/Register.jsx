import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../services/api';
import { validateName, validateEmail, validatePhone, validatePassword } from '../validations/rules';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import TermsModal from '../components/common/TermsModal';
import PrivacyModal from '../components/common/PrivacyModal';
import { Eye, EyeOff } from 'lucide-react';

const CURRENT_TERMS_VERSION = '1.0';

const Register = () => {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);
    let confirmErr = '';
    if (password !== confirmPassword) {
      confirmErr = 'Passwords do not match';
    }
    let termsErr = '';
    if (!termsAccepted) {
      termsErr = 'Please accept the Terms & Conditions and Privacy Policy to create your account.';
    }

    if (nameErr || emailErr || phoneErr || passErr || confirmErr || termsErr) {
      setErrors({
        name: nameErr || '',
        email: emailErr || '',
        phone: phoneErr || '',
        password: passErr || '',
        confirmPassword: confirmErr || '',
        terms: termsErr || ''
      });
      if (termsErr) {
        addToast(termsErr, 'warning');
      }
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { data } = await registerUser({
        name,
        email,
        phone,
        password,
        termsAccepted: true,
        termsVersion: CURRENT_TERMS_VERSION
      });

      if (data.success) {
        const userData = data.user || data;
        login(userData, data.token);
        addToast(`Account created successfully! Welcome, ${userData.name}`, 'success');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Email already exists or registration failed.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-asphalt">

      {/* Left Column: Visual presentation */}
      <section className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-asphalt flex-col justify-between p-16 text-chalk">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
            alt="Premium driving experience SUV"
            className="w-full h-full object-cover opacity-30 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-asphalt/90 to-asphalt/20" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="text-xs font-bold tracking-[0.4em] text-chalk font-sans">

          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl sm:text-6xl tracking-tighter uppercase leading-[0.95] text-chalk font-display">
            JOIN THE<br />SHOWROOM.
          </h2>
          <p className="text-[10px] text-silver leading-relaxed max-w-sm font-bold uppercase tracking-widest">
            Unlock professional vehicle configurations, track telemetry logs, and modify active reservations.
          </p>
        </div>

        <div className="relative z-10 text-[8px] font-bold uppercase tracking-widest text-silver">
          Secure Registry System &bull; Version 1.0
        </div>
      </section>

      {/* Right Column: Registration Form */}
      <section className="col-span-1 lg:col-span-5 flex items-center justify-center p-8 sm:p-16 bg-graphite/40 border-l border-white/5">
        <div className="max-w-sm w-full space-y-8">

          <header className="space-y-2">
            <h1 className="text-xl font-display uppercase tracking-widest text-chalk">CREATE ACCOUNT</h1>
            <p className="text-[10px] text-silver uppercase tracking-widest">
              Register configuration identity
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <Input
              label="Full Name"
              name="name"
              required
              disabled={loading}
              value={name}
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="ENTER FULL NAME"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              disabled={loading}
              value={email}
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="ENTER EMAIL ADDRESS"
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              required
              disabled={loading}
              value={phone}
              error={errors.phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              placeholder="PHONE WITH AREA CODE"
            />

            <div className="flex flex-col gap-1.5 w-full relative">
              <label htmlFor="reg-password" className="text-[9px] font-bold text-silver uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-3 pr-10 py-3 bg-graphite border text-xs text-chalk placeholder-silver/50 focus:outline-none focus:border-neon-accent rounded-none ${errors.password ? 'border-rose-900 bg-rose-950/20' : 'border-white/10'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-3 flex items-center text-silver hover:text-chalk transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span role="alert" className="text-rose-400 text-[9px] font-bold tracking-widest uppercase mt-0.5">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full relative">
              <label htmlFor="reg-confirmPassword" className="text-[9px] font-bold text-silver uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-3 pr-10 py-3 bg-graphite border text-xs text-chalk placeholder-silver/50 focus:outline-none focus:border-neon-accent rounded-none ${errors.confirmPassword ? 'border-rose-900 bg-rose-950/20' : 'border-white/10'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-3 flex items-center text-silver hover:text-chalk transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span role="alert" className="text-rose-400 text-[9px] font-bold tracking-widest uppercase mt-0.5">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col gap-1.5 py-1">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  disabled={loading}
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="mt-0.5 h-4 w-4 text-neon-accent focus:ring-neon-accent bg-asphalt border-white/10 rounded cursor-pointer accent-neon-accent"
                />
                <label htmlFor="terms" className="ml-2.5 text-[10px] font-medium leading-relaxed text-silver/90 select-none cursor-pointer">
                  I agree to Torque's{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-neon-accent font-bold uppercase tracking-wider hover:underline cursor-pointer focus:outline-none"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                    className="text-neon-accent font-bold uppercase tracking-wider hover:underline cursor-pointer focus:outline-none"
                  >
                    Privacy Policy
                  </button>.
                </label>
              </div>
              {errors.terms && (
                <span role="alert" className="text-rose-400 text-[9px] font-bold tracking-widest uppercase mt-0.5 block">
                  {errors.terms}
                </span>
              )}
            </div>

            {/* Submit Button - Disabled until Terms Accepted */}
            <Button
              type="submit"
              loading={loading}
              disabled={!termsAccepted || loading}
              className="w-full py-4 mt-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              JOIN THE DRIVE
            </Button>

          </form>

          <footer className="text-center pt-6 border-t border-white/5 flex justify-center items-center gap-1.5 uppercase font-bold text-[9px] tracking-widest">
            <span className="text-silver">Already registered?</span>
            <Link
              to="/login"
              className="text-neon-accent hover:underline"
            >
              Sign In
            </Link>
          </footer>

        </div>
      </section>

      {/* Modals */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
        }}
      />

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
        }}
      />

    </main>
  );
};

export default Register;
