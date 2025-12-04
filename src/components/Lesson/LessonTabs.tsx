import React, { useState } from 'react';

interface LessonTabsProps {
    children?: React.ReactNode;
}

export const LessonTabs: React.FC<LessonTabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<'notes' | 'resources'>('notes');


    {/* Tab content */ }
    <div className="py-2">
        {activeTab === 'notes' ? (
            <div className="space-y-3 text-gray-700">
                {children || (
                    <>
                        <p className="text-sm leading-relaxed">
                            Here are the key takeaways from this lesson. Focus on the
                            vocabulary for places and the common phrases for asking and
                            giving directions.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>
                                    <strong>Où est la bibliothèque?</strong> - Where is the
                                    library?
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>
                                    <strong>Tournez à gauche/droite</strong> - Turn left/right.
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>
                                    <strong>Continuez tout droit</strong> - Continue straight
                                    ahead.
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>
                                    <strong>C'est près d'ici</strong> - It's near here.
                                </span>
                            </li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-4">
                            Practice these phrases with a partner. You can find more
                            exercises in the Resources tab.
                        </p>
                    </>
                )}
            </div>
        ) : (
            <div className="space-y-3 text-gray-700">
                <p className="text-sm">
                    Additional resources and materials will appear here.
                </p>
            </div>
        )}
    </div>
        </div >
    );
};
