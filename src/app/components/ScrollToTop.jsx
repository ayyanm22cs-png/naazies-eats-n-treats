import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // We use 'instant' here because a smooth scroll during page transitions 
        // can sometimes feel laggy or reveal the bottom of the previous page.
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    return null;
}