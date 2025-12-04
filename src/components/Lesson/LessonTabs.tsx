import React, { useState } from 'react';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { Media } from '@/types/media';

interface LessonTabsProps {
    children?: React.ReactNode;
    mediaList?: Media[];
    currentMediaId?: number;
    onMediaSelect?: (media: Media, index: number) => void;
    isWebView?: boolean;
}

export const LessonTabs: React.FC<LessonTabsProps> = ({
    children,
    mediaList = [],
    currentMediaId,
    onMediaSelect,
    isWebView = false
}) => {
    const [activeTab, setActiveTab] = useState<'notes' | 'resources'>(
        isWebView ? 'resources' : 'notes'
    );

    return (
        <div className="space-y-4">
            {/* Tab buttons */}
            <div className="flex border-b border-gray-200">
                {!isWebView && (
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`px-4 py-2 text-sm font-medium transition-all relative ${activeTab === 'notes'
                            ? 'text-orange-500'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Description
                        {activeTab === 'notes' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                        )}
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 text-sm font-medium transition-all relative ${activeTab === 'resources'
                        ? 'text-orange-500'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Liste de lectures
                    {activeTab === 'resources' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
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
                    <div className="space-y-2">
                        {mediaList.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {mediaList.map((media, index) => (
                                    <div
                                        key={media.id}
                                        onClick={() => onMediaSelect?.(media, index)}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${currentMediaId === media.id
                                            ? 'bg-orange-50 border-2 border-orange-500'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 ${currentMediaId === media.id ? 'text-orange-500' : 'text-gray-400'
                                            }`}>
                                            {currentMediaId === media.id ? (
                                                <PlayCircle className="w-6 h-6" />
                                            ) : (
                                                <CheckCircle className="w-6 h-6" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-medium truncate ${currentMediaId === media.id ? 'text-orange-600' : 'text-gray-900'
                                                }`}>
                                                {media.titre}
                                            </h4>
                                            {media.description && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {media.description.replace(/<[^>]*>/g, '').substring(0, 60)}...
                                                </p>
                                            )}
                                        </div>

                                        {/* Number */}
                                        <div className={`flex-shrink-0 text-xs font-medium ${currentMediaId === media.id ? 'text-orange-500' : 'text-gray-400'
                                            }`}>
                                            #{index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">La liste de lectures apparaîtra ici.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
