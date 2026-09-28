'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, Package, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/lib/i18n/translations';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.login(data);
      if (response.success) {
        setAuth(response.data);
        router.replace('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Top right language and theme controls */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Background decorations */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
            marginBottom: '20px',
          }}>
            <Package size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>
            <span className="gradient-text">{t('appName')}</span>
            <span style={{ color: 'var(--text-primary)' }}> {t('managementSystem')}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t('signInSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>
            {t('welcomeBack')}
          </h2>

          {/* Error alert */}
          {error && (
            <div className="animate-fade-in" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            }}>
              <AlertCircle size={16} color="#f87171" />
              <span style={{ fontSize: '13px', color: '#f87171' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label" htmlFor="email">{t('email')}</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail')}
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

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="label" htmlFor="password" style={{ marginBottom: 0 }}>{t('password')}</label>
                <Link
                  href="/forgot-password"
                  id="link-forgot-password"
                  style={{
                    fontSize: '12px',
                    color: 'var(--primary-light)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enterPassword')}
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
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

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', borderRadius: '12px' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          &copy; 2026 Inventory Management System
        </p>
      </div>
    </div>
  );
}
