import React, { useEffect, useState } from "react";
import { School, BarChart2, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const splash1 = "/assets/splash1.jpeg";
const splash2 = "/assets/splash2.jpeg";
const splash3 = "/assets/splash3.jpeg";
const logonsImg = "/assets/NS.png"; // public asset
import wiziLogo from "@/assets/logo.png";

export default function OnboardingCarousel() {
  const navigate = useNavigate();

  const slides = [
    {
      title: "Apprentissage Mobile",
      description:
        "Accédez à des leçons courtes et efficaces où que vous soyez. Optimisez votre temps libre pour développer vos compétences.",
      image: splash1,
      icon: <School className="h-7 w-7 text-orange-500" />,
    },
    {
      title: "Suivi de Progrès",
      description:
        "Visualisez votre évolution avec des statistiques détaillées et des récompenses motivantes pour maintenir votre engagement.",
      image: splash2,
      icon: <BarChart2 className="h-7 w-7 text-orange-500" />,
    },
    {
      title: "Contenu Expert",
      description:
        "Bénéficiez de contenus créés par des experts pour maximiser votre apprentissage et atteindre vos objectifs rapidement.",
      image: splash3,
      icon: <BadgeCheck className="h-7 w-7 text-orange-500" />,
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenOnboarding");
    if (seen === "true") {
      // if already seen we don't force navigation here — landing will scroll to main content
      return;
    }
  }, []);

  const goNext = () => {
    if (current < slides.length - 1) setCurrent((c) => c + 1);
    else finishOnboarding();
  };

  const skip = () => finishOnboarding();

  const finishOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    // Prefer client-side navigation to /login
    try {
      navigate("/login");
    } catch (_) {
      // fallback: do a full navigation
      window.location.href = "/login";
    }
  };

  return (
    <div className="py-8 px-4 lg:px-12">
      <div className="flex items-center justify-center mb-4 mt-10">
        <div className="flex items-center gap-6">

          <img
            src={logonsImg}
            alt="NS Conseil"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 opacity-90"
          />
          <img
            src={wiziLogo}
            alt="Wizi Learn"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28"
          />
        </div>
        {/* <div>
          <button onClick={skip} className="text-sm text-orange-600 font-semibold">
            Passer
          </button>
        </div> */}
      </div>

      <div className="bg-white/80 rounded-2xl p-6 shadow-md max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg mb-6 flex items-center justify-center bg-gray-50">
            <img src={slides[current].image} alt={slides[current].title} className="object-cover w-full h-full" />
          </div>

          <div className="flex items-center gap-3 mb-3">{slides[current].icon}</div>

          <h2 className="text-2xl font-bold text-orange-600 mb-3">{slides[current].title}</h2>
          <p className="text-base text-gray-700 max-w-2xl">{slides[current].description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((s, idx) => (
            <button
              key={s.title}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-orange-600" : "bg-gray-300"}`}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">

          <button onClick={goNext} className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-800 transition-colors">
            {current === slides.length - 1 ? "Se connecter" : "Suivant"}
          </button>
          {
            current === slides.length - 1 ? "" : (
              // <button
              //   onClick={finishOnboarding}
              //   className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-orange-700 transition-colors"
              // >
              //   Commencer
              // </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-orange-600 border-2 border-orange-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-orange-50 transition-colors"
              >
                Se connecter
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}
