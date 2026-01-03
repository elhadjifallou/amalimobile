import { useEffect, useState } from 'react';
import logoAmali from "../assets/logoamali.png";


interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-200 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Juste le logo - Ultra minimaliste */}
      <div className="animate-fade-in">
        <img
          src={logoAmali}
          alt="AMALI"
          className="w-40 h-40 object-contain"
        />
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}