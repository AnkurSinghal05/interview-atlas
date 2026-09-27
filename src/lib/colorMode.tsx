import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from './storage';

export type ColorModePref = 'system' | 'light' | 'dark';
type Resolved = 'light' | 'dark';

const KEY = 'atlas:color-mode';
const Ctx = createContext<{ pref: ColorModePref; resolved: Resolved; setPref: (p: ColorModePref) => void } | null>(null);

// "system" follows the OS, or a data-theme attribute an embedding host may set on <html>.
function systemMode(): Resolved {
  const hostTheme = document.documentElement.getAttribute('data-theme');
  if (hostTheme === 'light' || hostTheme === 'dark') return hostTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ColorModePref>(() => (readStorage(KEY) as ColorModePref) || 'system');
  const [system, setSystem] = useState<Resolved>(systemMode);

  useEffect(() => {
    const update = () => setSystem(systemMode());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', update);
      mo.disconnect();
    };
  }, []);

  const resolved = pref === 'system' ? system : pref;
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    root.style.colorScheme = resolved;
  }, [resolved]);

  const setPref = (p: ColorModePref) => {
    setPrefState(p);
    writeStorage(KEY, p);
  };
  return <Ctx.Provider value={{ pref, resolved, setPref }}>{children}</Ctx.Provider>;
}

export function useColorMode() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useColorMode must be used inside ColorModeProvider');
  return ctx;
}
