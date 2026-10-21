"use client"

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Button, Form, Input } from '@heroui/react';
import { useUI } from '@/context/ui-context';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SearchProductCard from '../card/SearchProductCard';
import ProductEmpty from '../ui/empty/product-empty';
import SearchHorizontalLoader from '../ui/loaders/search-horizontal-loader';
import { useLocale, useTranslations } from 'next-intl';

export default function SearchModal() {
    const locale: string = useLocale()
    const t = useTranslations('search')
    const { isSearchModalOpen, closeSearchModal } = useUI();

    const searchKeys: { label: string; value: string }[] = [
        { label: t('keys.icumsa_45'),           value: 'ICUMSA 45' },
        { label: t('keys.icumsa_150'),          value: 'ICUMSA 150' },
        { label: t('keys.icumsa_600'),          value: 'ICUMSA 600-1200' },
        { label: t('keys.frozen_chicken_feet'), value: 'Frozen Chicken Feet' },
        { label: t('keys.frozen_chicken_paws'), value: 'Frozen Chicken Paws' },
        { label: t('keys.halal_chicken'),       value: 'Halal Chicken' },
        { label: t('keys.sunflower_oil'),       value: 'Sunflower Oil' },
        { label: t('keys.soybean_oil'),         value: 'Soybean Oil' },
    ];
    const { control, watch, setValue, getValues } = useForm<{ search: string }>({
        defaultValues: { search: '' },
    });
    const query = watch('search', '');
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredResults, setFilteredResults] = useState<any[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fileName = locale === "pt-br" ? 'products-br.json' : 'products.json';
                const res = await fetch(`/api/${fileName}`);
                const data = await res.json();
                setAllProducts(data);
            } catch (err) {
                console.error(`Error loading ${locale === "pt-br" ? 'products-br.json' : 'products.json'}:`, err);
            }
        };

        loadProducts();
    }, [locale]); 


    const filterResults = (searchValue: string) => {
        if (!searchValue || searchValue.length < 2) {
            setFilteredResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const debounce = setTimeout(() => {
            const results = allProducts.filter((product) =>
                product.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredResults(results);
            setLoading(false);
        }, 300);

        return () => clearTimeout(debounce);
    };

    useEffect(() => {
        filterResults(query);
    }, [query, allProducts]);

    const handleKeyClick = (key: string) => {
        setValue('search', key);
        filterResults(key);
    };


    return (
        <Modal hideCloseButton size='5xl' isOpen={isSearchModalOpen} scrollBehavior='inside' onOpenChange={closeSearchModal} placement="center" className='rounded-[50px]'>
            <ModalContent className='p-8 2xl:h-[700px]'>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-8">
                            <h6 className='text-2xl md:text-4xl text-primary tracking-wide font-normal'>{t('heading')}</h6>
                            <Form className="w-full" >
                                <Controller
                                    control={control}
                                    name="search"
                                    render={({ field }) => (
                                        <Input
                                            isClearable
                                            size='lg'
                                            {...field}
                                            classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                            placeholder={t('placeholder')}
                                            labelPlacement="outside"
                                            type="text"
                                            onClear={() => {
                                                setValue('search', '')
                                            }}
                                        />
                                    )}
                                />
                            </Form>
                        </ModalHeader>
                        <ModalBody>

                            <div className='mt-5'>
                                {loading &&
                                    <div className='flex flex-col gap-2'>
                                        {Array.from({ length: 5 }).map((_, i) => <SearchHorizontalLoader key={i} />)}
                                    </div>}
                                {query && filteredResults.length > 0 && (
                                    <div>
                                        {filteredResults.map((item, index) => (
                                            <SearchProductCard data={item} key={index} locale={locale} />
                                        ))}
                                    </div>
                                )}

                                {getValues('search') === '' && (
                                    <div className='mt-4'>
                                        <span className="text-base font-semibold">{t('suggestions_label')}</span>
                                        <div className='flex flex-wrap items-center gap-3 mt-5'>
                                            {searchKeys.map((key, index) => (
                                                <Button
                                                    color='default'
                                                    radius='full'
                                                    variant='flat'
                                                    key={index}
                                                    size="sm"
                                                    onPress={() => handleKeyClick(key.value)}
                                                >
                                                    <span className='font-medium'>{key.label}</span>
                                                </Button>
                                            ))}

                                        </div>
                                    </div>
                                )}

                                {!loading && query && filteredResults.length === 0 && (
                                    <ProductEmpty image='/images/error/search-empty.png' />
                                )}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
