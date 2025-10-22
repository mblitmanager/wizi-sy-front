import { Gamepad2, HelpCircle, Trophy } from "lucide-react";

const steps = [
  {
    icon: <Gamepad2 className="w-8 h-8 text-orange-500" />,
    title: "Choisissez un quiz",
    description: "Sélectionnez un quiz à découvrir.",
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-blue-500" />,
    title: "Répondez aux questions",
    description: "Testez vos connaissances en répondant à une série de questions.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    title: "Gagnez des points",
    description: "Accumulez des points pour chaque bonne réponse et montez dans le classement.",
  },
];

export const HowToPlay = () => {
  return (
    <div className="rounded-xl p-6 my-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Comment jouer ?
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-full">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};