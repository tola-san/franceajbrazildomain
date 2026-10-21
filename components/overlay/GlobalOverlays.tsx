"use client";

import dynamic from "next/dynamic";

// Every overlay below renders null until the user opens it (HeroUI's Modal and
// Drawer render nothing while `isOpen` is false, and GetQuotationModal early-returns),
// so none of this belongs in the initial payload. They are split as a group because
// they share the same @heroui/react surface -- splitting only some of them leaves that
// dependency in the first load and the split buys nothing. This client wrapper exists
// so `ssr: false` is legal at all: the root layout is a Server Component. No loading
// placeholders are needed, as there is nothing on screen to reserve space for.
const SearchModal = dynamic(() => import("@/components/modal/SearchModal"), { ssr: false });
const GetQuotationModal = dynamic(() => import("@/components/modal/GetQuotationModal"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/cart/CartDeawer"), { ssr: false });
const MobileMenuDrawer = dynamic(() => import("@/components/drawer/MobileMenuDrawer"), { ssr: false });

export default function GlobalOverlays() {
    return (
        <>
            <SearchModal />
            <GetQuotationModal />
            <CartDrawer />
            <nav aria-label="Mobile navigation">
                <MobileMenuDrawer />
            </nav>
        </>
    );
}
