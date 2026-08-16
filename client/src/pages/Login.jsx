import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../services/api';
import { validateEmail, validatePassword } from '../validations/rules';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(fromPath, { replace: true });
    }
  }, [user, navigate, fromPath]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    const emailErr = validateEmail(cleanEmail);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setEmailError(emailErr || '');
      setPasswordError(passErr || '');
      return;
    }

    setEmailError('');
    setPasswordError('');
    setLoading(true);

    try {
      const { data } = await loginUser({ email: cleanEmail, password });
      if (data.success) {
        const userData = data.user || data;
        login(userData, data.token);
        addToast(`Welcome back, ${userData.name || 'Client'}!`, 'success');
        navigate(fromPath, { replace: true });
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Invalid email or password';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-asphalt">
      {/* Left Column: Dark Cinematic Image Overlay */}
      <section className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-asphalt flex-col justify-between p-16 text-chalk">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
            alt="Futuristic driving launch"
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
            DRIVE WITH FORCE.
          </h2>
          <p className="text-[10px] text-silver leading-relaxed max-w-sm font-bold uppercase tracking-widest">
            YOUR DRIVE. YOUR TORQUE. ENTER WORKSPACE CREDENTIALS TO UNLOCK.
          </p>
        </div>

        <div className="relative z-10 text-[8px] font-bold uppercase tracking-widest text-silver">
          Secure Authenticated Session
        </div>
      </section>

      {/* Right Column: Clean Showroom Form (No floating card box) */}
      <section className="col-span-1 lg:col-span-5 flex items-center justify-center p-8 sm:p-16 bg-graphite/40 border-l border-white/5">
        <div className="max-w-sm w-full space-y-8">

          <header className="space-y-2">
            <h1 className="text-xl font-display uppercase tracking-widest text-chalk">SIGN IN</h1>
            <p className="text-[10px] text-silver uppercase tracking-widest">
              Authenticate database credentials
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              disabled={loading}
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              placeholder="ENTER REGISTERED EMAIL"
            />

            <div className="flex flex-col gap-1.5 w-full relative">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-[9px] font-bold text-silver uppercase tracking-widest">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] font-bold text-neon-accent uppercase tracking-widest hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-3 pr-10 py-3 bg-graphite border text-xs text-chalk placeholder-silver/50 focus:outline-none focus:border-neon-accent rounded-none ${passwordError ? 'border-rose-900 bg-rose-950/20' : 'border-white/10'
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

              {passwordError && (
                <span role="alert" className="text-rose-450 text-[9px] font-bold tracking-widest uppercase mt-0.5">{passwordError}</span>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-4"
            >
              ENTER TORQUE
            </Button>
          </form>

          <footer className="text-center pt-6 border-t border-white/5 flex justify-center items-center gap-1.5 uppercase font-bold text-[9px] tracking-widest">
            <span className="text-silver">New client?</span>
            <Link
              to="/register"
              className="text-neon-accent hover:underline"
            >
              Sign Up
            </Link>
          </footer>

        </div>
      </section>

    </main>
  );
};

export default Login;
