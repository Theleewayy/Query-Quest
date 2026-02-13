import { useEffect } from 'react';

/**
 * useGravityFailure Hook
 * 
 * Applies the 'weightless' animation to all elements with the 'floating-ui' class
 * when gravity failure is triggered (typically on final level completion).
 * 
 * @param isActive - Boolean to toggle gravity failure effect
 */
export function useGravityFailure(isActive: boolean) {
    useEffect(() => {
        if (!isActive) return;

        // Find all elements with the floating-ui class
        const floatingElements = document.querySelectorAll('.floating-ui');

        // Apply weightless class with staggered delays
        floatingElements.forEach((element, index) => {
            if (element instanceof HTMLElement) {
                // Add weightless class
                element.classList.add('weightless');

                // Set custom delay for staggered effect
                element.style.setProperty('--delay', index.toString());
            }
        });

        // Cleanup function to remove the effect
        return () => {
            floatingElements.forEach((element) => {
                if (element instanceof HTMLElement) {
                    element.classList.remove('weightless');
                    element.style.removeProperty('--delay');
                }
            });
        };
    }, [isActive]);
}
