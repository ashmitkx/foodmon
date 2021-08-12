import { useState, useEffect } from 'react';

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });

    useEffect(() => {
        const handleResize = () => setWindowDimensions({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};
