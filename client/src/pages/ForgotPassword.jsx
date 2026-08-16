import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { validateEmail } from '../validations/rules';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { KeyRound, ArrowRight, Check } from 'lucide-react';

const ForgotPassword = () => {
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mockLink, setMockLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const { data } = await forgotPassword({ email });
      if (data.success) {
        addToast('Password reset link simulated successfully', 'success');
        setSuccess(true);
        setMockLink(data.mockLink);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error processing request';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-asphalt text-chalk">
      <div className="max-w-sm w-full bg-graphite border border-white/5 p-8 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display uppercase tracking-widest text-chalk">Forgot Password</h2>
          <p className="mt-2 text-xs text-silver">
            Enter configuration email to simulate reset links.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-asphalt p-5 border border-white/10 space-y-3 uppercase tracking-wider text-[9px] font-bold">
              <div className="flex gap-2 items-center text-neon-accent font-bold">
                <Check className="w-4 h-4" />
                <span>Email simulated successfully</span>
              </div>
              <p className="text-silver/80 leading-relaxed">
                For testing purposes, click the link below to load the reset password view:
              </p>
              <a
                href={mockLink}
                target="_blank"
                rel="noreferrer"
                className="text-neon-accent hover:underline break-all block pt-1"
              >
                {mockLink}
              </a>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 bg-asphalt border border-white/10 text-[9px] font-bold text-chalk hover:bg-stone/10 transition-colors uppercase tracking-widest"
            >
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              placeholder="ENTER REGISTERED EMAIL"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5"
            >
              <span>Send Simulated Email</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {!success && (
          <div className="text-center text-[9px] tracking-widest uppercase font-bold text-silver pt-4 border-t border-white/5">
            <span>Remembered it?</span>{' '}
            <Link to="/login" className="font-bold text-neon-accent hover:underline inline-flex items-center gap-0.5">
              <span>Sign In</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
