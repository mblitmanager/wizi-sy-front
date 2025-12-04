import React, { useState } from 'react';

interface LessonTabsProps {
    children?: React.ReactNode;
}

export const LessonTabs: React.FC<LessonTabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<'notes' | 'resources'>('notes');

    return (
        <div className="space-y-4">
            {/* Tab buttons */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-2 text-sm font-medium transition-all relative ${activeTab === 'notes'
                            ? 'text-[#00D563]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Notes de leçon
                    {activeTab === 'notes' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D563]" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 text-sm font-medium transition-all relative ${activeTab === 'resources'
                            ? 'text-[#00D563]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Ressources
                    {activeTab === 'resources' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D563]" />
                    )}
                </button>
            </div>

            {/* Tab content */}
            <div className="py-2">
                {activeTab === 'notes' ? (
                    <div className="space-y-3 text-gray-700">
                        {children || (
                            <>
                                <p className="text-sm leading-relaxed">
                                    Voici les points clés de cette leçon. Concentrez-vous sur le
                                    vocabulaire des lieux et les expressions courantes pour demander et
                                    donner des indications.
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            <strong>Où est la bibliothèque?</strong> - Où est la
                                            bibliothèque?
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            <strong>Tournez à gauche/droite</strong> - Tournez à gauche/droite.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            <strong>Continuez tout droit</strong> - Continuez tout
                                            droit.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            <strong>C'est près d'ici</strong> - C'est près d'ici.
                                        </span>
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    Pratiquez ces phrases avec un partenaire. Vous pouvez trouver plus
                                    d'exercices dans l'onglet Ressources.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 text-gray-700">
                        <p className="text-sm">
                            Les ressources et matériels supplémentaires apparaîtront ici.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
