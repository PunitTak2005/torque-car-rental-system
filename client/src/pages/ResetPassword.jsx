import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { validatePassword } from '../validations/rules';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Lock, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passErr = validatePassword(password);
    if (passErr) {
      setPasswordError(passErr);
      return;
    }
    setPasswordError('');

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }
    setConfirmError('');

    setLoading(true);
    try {
      const { data } = await resetPassword(token, { password });
      if (data.success) {
        addToast('Password updated successfully. Please login with your new credentials.', 'success');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Token expired or invalid';
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
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display uppercase tracking-widest text-chalk">Reset Password</h2>
          <p className="mt-2 text-xs text-silver">
            Configure secure new password values for account credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New Password"
            name="password"
            type="password"
            required
            value={password}
            error={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            placeholder="••••••••"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            error={confirmError}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmError) setConfirmError('');
            }}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3.5 text-xs"
          >
            <span>Update Password</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-[9px] tracking-widest uppercase font-bold text-silver pt-4 border-t border-white/5">
          <Link to="/login" className="font-bold text-neon-accent hover:underline">
            Cancel and Return
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
