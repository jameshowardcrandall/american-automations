import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { industryByKey, type Industry } from './config';

type Theme = 'light' | 'dark';

interface FunnelState {
  industry: Industry;
  setIndustryKey: (key: string) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Ctx = createContext<FunnelState | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [industryKeyState, setIndustryKeyState] = useState('all');
  const [theme, setTheme] = useState<Theme>('light');

  const setIndustryKey = useCallback((key: string) => setIndustryKeyState(key), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  const value = useMemo<FunnelState>(() => ({
    industry: industryByKey(industryKeyState),
    setIndustryKey,
    theme,
    toggleTheme,
  }), [industryKeyState, setIndustryKey, theme, toggleTheme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFunnel(): FunnelState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFunnel must be used inside <FunnelProvider>');
  return v;
}
