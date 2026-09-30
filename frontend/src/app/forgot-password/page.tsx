'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Package, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/auth-api';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/lib/i18n/translations';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authApi.forgotPassword({ email: data.email });
      if (response.success) {
        setSuccessMessage(
          response.message ||
            'If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.'
        );
      } else {
        setError(response.message || 'Unable to process request. Please try again.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message ||
          'An error occurred while requesting password reset. Please try again later.'
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
      {/* Top right language and theme controls */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Background decorations */}
      <div className="ambient-glow-wrapper" aria-hidden="true">
        <div className="ambient-orb ambient-orb-primary" />
        <div className="ambient-orb ambient-orb-secondary" />
        <div className="ambient-orb ambient-orb-accent" />
      </div>

      <div
        className="animate-slide-up"
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
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
            <span className="gradient-text">{t('appName')}</span>
            <span style={{ color: 'var(--text-primary)' }}> {t('managementSystem')}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t('forgotPasswordSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '10px',
              color: 'var(--text-primary)',
            }}
          >
            {t('forgotPasswordTitle')}
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '24px',
            }}
          >
            {t('forgotPasswordSubtitle')}
          </p>

          {/* Success Banner */}
          {successMessage && (
            <div
              className="animate-fade-in"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#34d399', marginBottom: '4px' }}>
                    {t('emailSent')}
                  </p>
                  <p style={{ fontSize: '13px', color: '#a7f3d0', lineHeight: '1.5' }}>
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#f87171' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label className="label" htmlFor="forgot-email-input">
                {t('email')}
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
                  <Mail size={16} />
                </div>
                <input
                  id="forgot-email-input"
                  type="email"
                  placeholder="admin@inventory.com"
                  className={`input-field ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '42px' }}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="forgot-submit-button"
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
                  {t('sendingResetLink')}
                </>
              ) : (
                t('sendResetLink')
              )}
            </button>
          </form>

          {/* Back to Sign In Link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              href="/login"
              id="back-to-login-link"
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
              {t('backToSignIn')}
            </Link>
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          {t('copyright')}
        </p>
      </div>
    </div>
  );
}
