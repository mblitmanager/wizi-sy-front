import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import './SwipeTutorial.css';

export const SwipeTutorial: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const tutorialShown = localStorage.getItem('swipe_tutorial_shown');
        if (!tutorialShown) {
            setShow(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('swipe_tutorial_shown', 'true');
        setShow(false);
        onClose?.();
    };

    if (!show) return null;

    return (
        <div className="swipe-tutorial-overlay">
            <div className="swipe-tutorial-content">
                <button className="tutorial-close" onClick={handleClose}>
                    <X size={20} />
                </button>

                <div className="tutorial-icon">
                    <div className="swipe-animation">
                        <ArrowLeft className="arrow arrow-left" size={32} />
                        <div className="hand-icon">👆</div>
                        <ArrowRight className="arrow arrow-right" size={32} />
                    </div>
                </div>

                <h3 className="tutorial-title">💡 Astuce de Navigation</h3>
                <p className="tutorial-text">
                    Vous pouvez <strong>glisser vers la gauche ou la droite</strong> pour naviguer rapidement entre les questions du quiz
                </p>

                <button className="tutorial-button" onClick={handleClose}>
                    Compris !
                </button>
            </div>
        </div>
    );
};
