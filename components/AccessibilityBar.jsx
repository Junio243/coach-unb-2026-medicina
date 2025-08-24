import React from 'react';
import { useStore } from '../store/useStore.js';
import Button from './ui/Button.jsx';

const AccessibilityBar = () => {
  const { accessibility, setAccessibility } = useStore();

  const toggleHighContrast = () => setAccessibility({ highContrast: !accessibility.highContrast });
  const toggleReduceMotion = () => setAccessibility({ reduceMotion: !accessibility.reduceMotion });
  const increaseFontSize = () => setAccessibility({ fontSize: Math.min(accessibility.fontSize + 0.1, 1.5) });
  const decreaseFontSize = () => setAccessibility({ fontSize: Math.max(accessibility.fontSize - 0.1, 0.8) });

  return (
    <div className="bg-slate-200 dark:bg-slate-950 p-2 text-sm text-slate-700 dark:text-slate-300">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <span>Acessibilidade:</span>
        <Button variant="outline" size="sm" onClick={toggleHighContrast}>
          {accessibility.highContrast ? 'Contraste Padrão' : 'Alto Contraste'}
        </Button>
        <Button variant="outline" size="sm" onClick={toggleReduceMotion}>
          {accessibility.reduceMotion ? 'Habilitar Animações' : 'Reduzir Animações'}
        </Button>
        <Button variant="outline" size="sm" onClick={decreaseFontSize}>A-</Button>
        <Button variant="outline" size="sm" onClick={increaseFontSize}>A+</Button>
      </div>
    </div>
  );
};

export default AccessibilityBar;