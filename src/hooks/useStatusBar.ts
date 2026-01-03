import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const useStatusBar = (isDarkMode: boolean) => {
  useEffect(() => {
    // Seulement sur mobile (iOS/Android)
    if (Capacitor.isNativePlatform()) {
      const setStatusBarStyle = async () => {
        try {
          if (isDarkMode) {
            // Mode sombre → Texte BLANC sur fond sombre
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#0f172a' }); // slate-900
          } else {
            // Mode clair → Texte NOIR sur fond clair
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: '#ffffff' }); // white
          }
        } catch (error) {
          console.log('Status bar non disponible');
        }
      };

      setStatusBarStyle();
    }
  }, [isDarkMode]);
};