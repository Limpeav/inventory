'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  Eye,
  EyeOff,
  Package,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Wand2,
} from 'lucide-react';
import { authApi } from '@/lib/auth-api';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be under 100 characters')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[@#$%^&+=!._-]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');

  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const specials = '@#$%^&+=!._-';
    
    let pass = '';
    pass += chars[Math.floor(Math.random() * chars.length)];
    pass += caps[Math.floor(Math.random() * caps.length)];
    pass += nums[Math.floor(Math.random() * nums.length)];
    pass += specials[Math.floor(Math.random() * specials.length)];
    
    const all = chars + caps + nums + specials;
    for (let i = 0; i < 8; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }
    
    pass = pass.split('').sort(() => 0.5 - Math.random()).join('');
    
    setValue('password', pass, { shouldValidate: true, shouldDirty: true });
    setValue('confirmPassword', pass, { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  // Password requirement checks
  const criteria = [
    { label: 'At least 8 characters', met: watchedPassword.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(watchedPassword) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(watchedPassword) },
    { label: 'At least one number', met: /[0-9]/.test(watchedPassword) },
    { label: 'At least one special character (@#$%^&+=!._-)', met: /[@#$%^&+=!._-]/.test(watchedPassword) },
    {
      label: 'Passwords match',
      met: watchedPassword.length > 0 && watchedPassword === watchedConfirmPassword,
    },
  ];

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('Missing or invalid reset token. Please request a new password reset link.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.resetPassword({
        token,
        newPassword: data.password,
      });

      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message ||
          'Failed to reset password. The link may have expired or already been used.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="gradient-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div
        className="animate-slide-up"
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              marginBottom: '20px',
            }}
          >
            <Package size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>
            <span className="gradient-text">Inventory</span>
            <span style={{ color: 'var(--text-primary)' }}> System</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Set a new secure password
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          {isSuccess ? (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  marginBottom: '20px',
                }}
              >
                <CheckCircle2 size={32} color="#10b981" />
              </div>

              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                Password Updated!
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '28px',
                }}
              >
                Your password has been changed successfully. You can now use your new password to sign in.
              </p>

              <Link
                href="/login"
                id="btn-goto-login"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                Sign In Now
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : !token ? (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={32} color="#ef4444" />
              </div>

              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                Invalid Reset Link
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '28px',
                }}
              >
                No valid password reset token was provided in the URL. Please request a new password reset link.
              </p>

              <Link
                href="/forgot-password"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Set New Password
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                }}
              >
                Choose a strong password to protect your account.
              </p>

              <button
                type="button"
                onClick={generateStrongPassword}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '10px',
                  color: 'var(--primary-light)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                }}
              >
                <Wand2 size={16} />
                Suggest Strong Password
              </button>

              {/* Error Alert */}
              {error && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                  }}
                >
                  <AlertCircle size={16} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '13px', color: '#f87171', lineHeight: '1.4' }}>{error}</span>
                    {error.toLowerCase().includes('expired') || error.toLowerCase().includes('already') ? (
                      <div style={{ marginTop: '8px' }}>
                        <Link
                          href="/forgot-password"
                          style={{
                            fontSize: '12px',
                            color: 'var(--primary-light)',
                            textDecoration: 'underline',
                          }}
                        >
                          Request a new link
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* New Password */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="label" htmlFor="reset-new-password">
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className={`input-field ${errors.password ? 'error' : ''}`}
                      style={{ paddingLeft: '42px', paddingRight: '42px' }}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="label" htmlFor="reset-confirm-password">
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                      style={{ paddingLeft: '42px', paddingRight: '42px' }}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Criteria Checklist */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '24px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                    }}
                  >
                    Password Requirements:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {criteria.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: item.met ? '#34d399' : 'var(--text-muted)',
                          transition: 'color 0.2s',
                        }}
                      >
                        {item.met ? (
                          <Check size={14} color="#34d399" />
                        ) : (
                          <X size={14} color="#64748b" />
                        )}
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="reset-submit-button"
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '13px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Updating Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>

              {/* Back to Sign In Link */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          &copy; 2026 Inventory Management System
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="gradient-bg"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
