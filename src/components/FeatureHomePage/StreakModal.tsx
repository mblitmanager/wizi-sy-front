interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginStreak: number;
  hideFor7Days: boolean;
  onHideFor7DaysChange: (checked: boolean) => void;
}

export const StreakModal = ({
  isOpen,
  onClose,
  loginStreak,
  hideFor7Days,
  onHideFor7DaysChange,
}: StreakModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Série de connexions">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center px-6 py-4 rounded bg-orange-50 border border-orange-100">
            <span className="text-5xl font-extrabold text-orange-600">🔥</span>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2937] mb-2">
          Série de connexions
        </h3>

        <p className="text-lg font-bold text-[#1f2937] mb-4">
          {loginStreak} jour{loginStreak > 1 ? "s" : ""} d'affilée
        </p>

        <div className="flex items-center justify-center mb-4">
          <input
            type="checkbox"
            id="hide-streak"
            checked={hideFor7Days}
            onChange={(e) => onHideFor7DaysChange(e.target.checked)}
            className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label
            htmlFor="hide-streak"
            className="ml-2 block text-sm text-[#1f2937]">
            Ne plus montrer pendant 7 jours
          </label>
        </div>

        <div className="flex justify-center gap-3">
          <button
            className="px-6 py-2 bg-[#feb823] text-white rounded-lg font-semibold hover:bg-[#fea523] transition-colors"
            onClick={onClose}>
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};
