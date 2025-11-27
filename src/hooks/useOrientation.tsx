import { useState, useEffect } from 'react';

interface OrientationState {
    isPortrait: boolean;
    isLandscape: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    screenWidth: number;
    screenHeight: number;
}

export const useOrientation = (): OrientationState => {
    const [orientation, setOrientation] = useState<OrientationState>(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isPortrait = height > width;
        const isLandscape = width > height;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isDesktop = width >= 1024;

        return {
            isPortrait,
            isLandscape,
            isMobile,
            isTablet,
            isDesktop,
            screenWidth: width,
            screenHeight: height,
        };
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isPortrait = height > width;
            const isLandscape = width > height;
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1024;
            const isDesktop = width >= 1024;

            setOrientation({
                isPortrait,
                isLandscape,
                isMobile,
                isTablet,
                isDesktop,
                screenWidth: width,
                screenHeight: height,
            });
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Also listen to orientation change event for mobile devices
        window.addEventListener('orientationchange', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return orientation;
};
