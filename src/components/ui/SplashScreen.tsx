import { useEffect, useState } from "react";

type SplashScreenProps = {
  isReady: boolean;
  onFinished: () => void;
};

export default function SplashScreen({
  isReady,
  onFinished,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 600);

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 1300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [isReady, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 transition-all duration-700 ${
        exiting ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`text-center transition-all duration-700 ${
          visible && !exiting
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-3xl shadow-lg">
            🌿
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-wide text-white">
          Digital Sanctuary
        </h1>

        <p className="mt-2 text-sm text-green-200">
          Skydda naturen tillsammans
        </p>

        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-green-600">
          <div className="h-full w-1/2 animate-pulse bg-green-300" />
        </div>
      </div>
    </div>
  );
}