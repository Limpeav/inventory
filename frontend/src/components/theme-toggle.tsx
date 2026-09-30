'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)'
      }} />
    );
  }

  const isDark = theme === 'dark';

  const handleToggle = () => {
    setIsRotating(true);
    setTheme(isDark ? 'light' : 'dark');
    setTimeout(() => setIsRotating(false), 400);
  };

  return (
    <button
      id="theme-toggle-btn"
      onClick={handleToggle}
      style={{
        width: '36px', height: '36px', borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-subtle)', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: isDark ? '#fbbf24' : '#6366f1',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: isRotating ? 'rotate(180deg) scale(0.8)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </div>
    </button>
  );
}
