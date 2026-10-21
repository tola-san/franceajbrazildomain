'use client';

import { Product } from '@/types/product';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextProps {
    isDrawerOpen: boolean;
    toggleDrawer: () => void;

    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;

    isSearchModalOpen: boolean;
    openSearchModal: () => void;
    closeSearchModal: () => void;

    alertMessage: string | null;
    showAlert: (msg: string) => void;
    clearAlert: () => void;


    isGetQuotationOpen: boolean;
    getQuotationData: Product | null;
    openGetQuotation: (data: Product) => void;
    closeGetQuotation: () => void;


}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Search Modal
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const openSearchModal = () => setSearchModalOpen(true);
    const closeSearchModal = () => setSearchModalOpen(false);

    // Get Quotation Modal
    const [isGetQuotationOpen, setIsGetQuotationOpen] = useState(false);
    const [getQuotationData, setGetQuotationData] = useState<Product | null>(null);
    const openGetQuotation = (data: Product) => {
        setGetQuotationData(data);
        setIsGetQuotationOpen(true);
    };
    const closeGetQuotation = () => {
        setIsGetQuotationOpen(false);
        setGetQuotationData(null);
    };


    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);





    const showAlert = (msg: string) => {
        setAlertMessage(msg);
        setTimeout(() => setAlertMessage(null), 3000);
    };
    const clearAlert = () => setAlertMessage(null);

    return (
        <UIContext.Provider
            value={{
                isDrawerOpen,
                toggleDrawer,
                isModalOpen,
                openModal,
                closeModal,

                alertMessage,
                showAlert,
                clearAlert,

                isSearchModalOpen,
                openSearchModal,
                closeSearchModal,

                isGetQuotationOpen,
                getQuotationData,
                openGetQuotation,
                closeGetQuotation
            }}
        >
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
}
