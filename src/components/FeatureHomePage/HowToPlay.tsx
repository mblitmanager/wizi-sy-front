import { Gamepad2, HelpCircle, Trophy } from "lucide-react";

const steps = [
  {
    icon: <Gamepad2 className="w-6 h-6 text-orange-500" />,
    title: "Choisissez un quiz",
    description: "Sélectionnez un quiz à découvrir.",
  },
  {
    icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
    title: "Répondez aux questions",
    description: "Testez vos connaissances en répondant à une série de questions.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-indigo-500" />,
    title: "Gagnez des points",
    description: "Accumulez des points à chaque bonne réponse et montez dans le classement.",
  },
];

export const HowToPlay = () => {
  return (
    <div className="rounded-xl p-6 my-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Comment jouer ?
      </h2>

      {/* Render as a simple numbered list to reduce visual noise */}
      <ol className="space-y-4 max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex items-start gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-800">
                {index + 1}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1 bg-transparent rounded">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};