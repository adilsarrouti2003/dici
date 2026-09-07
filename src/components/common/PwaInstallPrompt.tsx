import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if dismissed previously
      if (!sessionStorage.getItem('ninety_days_pwa_dismissed')) {
        setVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('ninety_days_pwa_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="no-print fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-[#0d284f] text-white p-4 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0">
          90
        </div>
        <div>
          <h5 className="text-xs font-bold leading-tight font-['Cairo']">Install 90 Days App</h5>
          <p className="text-[11px] text-blue-200">Track habits offline on your home screen</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3 py-1.5 bg-white text-[#0d284f] text-xs font-black rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-blue-300 hover:text-white rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
