import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div
            className={cn(
                'fixed bottom-6 right-6 z-40 transition-all duration-300 translate-y-0 opacity-100',
                !isVisible && 'translate-y-10 opacity-0 pointer-events-none'
            )}
        >
            <Button
                variant="default"
                size="icon"
                onClick={scrollToTop}
                className="h-12 w-12 rounded-full shadow-lg gradient-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                aria-label="Back to top"
            >
                <ChevronUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
            </Button>
        </div>
    );
};

export default BackToTop;
