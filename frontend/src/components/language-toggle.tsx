'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguageStore, Language } from '@/store/language-store';
import { Globe, Check } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        width: '74px', height: '36px', borderRadius: '10px',
        border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)'
      }} />
    );
  }

  const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'km', label: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  ];

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        id="language-toggle-btn"
        onClick={() => setOpen(prev => !prev)}
        style={{
          height: '36px',
          padding: '0 10px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-subtle)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-primary, #6366f1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
        }}
        title="Switch language / ប្តូរភាសា"
      >
        <span style={{ fontSize: '15px' }}>{current.flag}</span>
        <span style={{ fontSize: '12px', letterSpacing: '0.02em' }}>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: '180px',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          padding: '6px',
          zIndex: 100,
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ padding: '6px 8px 4px 8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Language / ភាសា
          </div>
          {languages.map(lang => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                id={`lang-select-${lang.code}`}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary, #6366f1)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isSelected ? '600' : '400',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '13px', lineHeight: 1.2 }}>{lang.nativeName}</span>
                    {lang.code === 'km' && (
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>Khmer</span>
                    )}
                  </div>
                </div>
                {isSelected && <Check size={14} color="var(--brand-primary, #6366f1)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
