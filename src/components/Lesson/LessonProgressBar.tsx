import React from 'react';

interface LessonProgressBarProps {
    current: number;
    total: number;
    percentage: number;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
    current,
    total,
    percentage,
}) => {
    return (
        <div className="space-y-2">
            {/* Progress label */}
            {/* <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                    Vous êtes à la leçon <span className="font-semibold">{current}</span> sur{' '}
                    <span className="font-semibold">{total}</span>
                </span>
            </div> */}

            {/* Module Progress */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progression du module</span>
                    <span className="text-sm font-bold text-[#00D563]">{percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E6F9F0] rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
