'use client';

import WhatsAppButton from './WhatsAppButton';

/**
 * Fixed chat launcher, visible on every breakpoint. Sits in the bottom-right
 * corner; ScrollToTop stacks above it in the same column (see ScrollToTop).
 */
const FloatingWhatsApp = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50 print:hidden">
            <WhatsAppButton />
        </div>
    );
};

export default FloatingWhatsApp;
