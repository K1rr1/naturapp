import { useState } from "react";

type Props = {
  onFinish: () => void;
};

type Slide = {
  icon: string;
  title: string;
  text: string;
};

const slides: Slide[] = [
  {
    icon: "📍",
    title: "Rapportera problem",
    text: "Markera skräp eller problem direkt på kartan.",
  },
  {
    icon: "📅",
    title: "Skapa städevent",
    text: "Organisera insatser tillsammans med andra.",
  },
  {
    icon: "🙋",
    title: "Delta och hjälp till",
    text: "Gå med i event och gör skillnad i din närmiljö.",
  },
  {
    icon: "🏆",
    title: "Samla poäng & gör skillnad",
    text: "Genom att rapportera, skapa och delta i event bygger du upp din profil och låser upp badges.",
  },
];

export default function Onboarding({ onFinish }: Props) {
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("naturapp-onboarding-done", "true");
      onFinish();
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("naturapp-onboarding-done", "true");
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gradient-to-b from-green-50 to-stone-100 px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl border border-black/5 p-6 text-center">
        
      
        <div className="mb-6 text-5xl">{current.icon}</div>

    
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {current.title}
        </h2>

      
        <p className="text-sm text-stone-600 mb-6">
          {current.text}
        </p>

       
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-green-700 scale-110" : "bg-stone-300"
              }`}
            />
          ))}
        </div>

        
        <button
          onClick={handleNext}
          className="w-full rounded-2xl bg-green-700 text-white py-3 font-medium shadow-sm transition hover:bg-green-800"
        >
          {isLast ? "Kom igång" : "Nästa"}
        </button>

        
        {!isLast && (
          <button
            onClick={handleSkip}
            className="mt-3 text-sm text-stone-500 hover:text-stone-700 transition"
          >
            Hoppa över
          </button>
        )}
      </div>
    </div>
  );
}