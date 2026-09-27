import { Monitor, Moon, Sun } from 'lucide-react';
import { useColorMode, type ColorModePref } from '@/lib/colorMode';
import { Button } from '@/components/ui/button';

const MODES: { value: ColorModePref; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'system', label: 'Match system theme', Icon: Monitor },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
];

export function ColorModeToggle() {
  const { pref, setPref } = useColorMode();
  return (
    <div className="flex w-fit gap-0.5 rounded-md border p-0.5" role="group" aria-label="Theme">
      {MODES.map(({ value, label, Icon }) => (
        <Button
          key={value}
          size="icon-sm"
          variant={pref === value ? 'secondary' : 'ghost'}
          aria-label={label}
          title={label}
          aria-pressed={pref === value}
          onClick={() => setPref(value)}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
