"use client"

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, AutocompleteItem, Form, Input, Button, Textarea, Avatar, Card, CardHeader, CardBody, CardFooter, RadioGroup, Radio, useRadio, VisuallyHidden, cn, addToast } from '@heroui/react';
import {
    buildPhonePrefixes,
    makePhonePrefixFilter,
    moveCaretToEnd,
    phonePrefixLabel,
    PhonePrefix,
} from '@/lib/phone-prefixes';
import { EmailForm } from '@/types/contact';
import Breadcrumb from '@/components/ui/Breadcrumbs';
import { useCart } from '@/context/cart/cart-context';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { StepperButton } from '@/components/button/StepperButton';
import { FiMinus, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import useSendQuotation from '@/hooks/useSendQuotation';
import CartEmpty from '@/components/ui/cart/cart-empty';
import { PiSealCheckDuotone } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PageStatusBar from '@/components/navbar/PageStatusBar';
import { FALLBACK_VARIATION_SUMMARY } from '@/lib/products/variation';

type Country = {
    name: string;
    dial_code: string;
    code: string;
};

const QuotationsPageContent = () => {
    const t = useTranslations('quotation_page')
    const f = useTranslations('form')
    const { state, dispatch } = useCart()
    const breadcrumbItems = [
        { label: t('home'), href: "/" },
        { label: t('quotations_title'), isCurrent: true },
    ];

    const [countries, setCountries] = useState<Country[]>([]);
    // Dial codes are shared by several countries, so the picker lists each
    // code once and searches across every country name using it.
    const phonePrefixes = useMemo(() => buildPhonePrefixes(countries), [countries]);
    const phonePrefixInputRef = useRef<HTMLInputElement>(null);
    const { mutate: sendQuotation, isPending, isSuccess, isError, error } = useSendQuotation()
    const {
        register,
        watch,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EmailForm>({
        defaultValues: {
            phonePrefix: '+55',
        },
    });

    const selectedPhonePrefix = watch('phonePrefix');
    const phonePrefixFilter = useMemo(
        () => makePhonePrefixFilter(phonePrefixes, selectedPhonePrefix),
        [phonePrefixes, selectedPhonePrefix],
    );



    useEffect(() => {
        const fetchData = async () => {
            try {
                const countriesRes = await fetch('/api/countries.json');
                const countriesData: Country[] = await countriesRes.json();
                setCountries(countriesData);

                const geoRes = await fetch('https://ipwho.is/');
                const geoData = await geoRes.json();
                const callingCode = `+${geoData.calling_code}`;
                setValue('phonePrefix', callingCode);
            } catch (error) {
                console.error('Geo or country detection failed:', error);
            }
        };

        fetchData();
    }, [setValue]);




    const onSubmit = (contact: EmailForm) => {
        sendQuotation(
            {
                products: state.items,
                contact: contact
            }, {
            onSuccess: () => {
                reset()
                dispatch({ type: 'RESET_CART' })
                addToast({
                    title: "Quotation Request Sent Successfully!",
                    description: "Thank you for reaching out. Our team has received your quotation request and will respond to you shortly.",
                    color: "success",
                    icon: (
                        <PiSealCheckDuotone />
                    ),
                    classNames: {
                        base: "rounded-[20px] bg-[#D2C8C3] p-3 border border-primary  max-w-xl",
                        title: "text-base font-mono text-primary line-clamp-1",
                        description: "text-black",
                        icon: "text-primary",
                        closeIcon: "bg-[#D2C8C3]"
                    },
                })
            },
        })
    };

    const fadeUpStaggerContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const fadeUpItem = {
        hidden: { opacity: 0, y: 180 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="container mx-auto mb-20">
            <PageStatusBar title={t('quotations_title')} />
            <div className='hidden lg:block'>
                <div className="relative flex flex-col items-center mb-10 xl:mb-20 xl:mt-5 ">
                    <h1 className="text-2xl lg:text-6xl text-primary mb-5">{t('quotations_title')}</h1>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>


            <Form onSubmit={handleSubmit(onSubmit)} className='mt-8 lg:mt-0'>
                <div className="grid grid-cols-12 gap-8 w-full">
                    <motion.div className="col-span-12 lg:col-span-7 "
                        variants={fadeUpStaggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        {/* Card Company Information */}
                        <motion.div
                            className='bg-white rounded-3xl lg:rounded-[50px] min-h-72 p-8 lg:p-10 mb-8'
                            variants={fadeUpItem}>
                            <h2 className="text-2xl lg:text-3xl text-primary mb-16">{t('company_info')}</h2>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-10'>
                                <Input
                                    isRequired
                                    label={f('company_name')}
                                    color='primary'
                                    variant='bordered'
                                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                    size='lg'
                                    labelPlacement="outside"
                                    placeholder={f('company_name_placeholder')}
                                    type="text"
                                    errorMessage={f('company_name_err_ms')}
                                    {...register('companyName', {
                                        required: f('company_name_required'),
                                    })}
                                />
                                <Controller
                                    control={control}
                                    name="region"
                                    rules={{ required: f('region_required') }}
                                    render={({ field, fieldState }) => (
                                        <Autocomplete
                                            isRequired
                                            // Surface react-hook-form's message inline instead of the
                                            // browser's native required bubble.
                                            validationBehavior="aria"
                                                                            color="primary"
                                                                            variant="bordered"
                                            label={f('region')}
                                            size="lg"
                                            labelPlacement="outside"
                                            placeholder={f('region_placeholder')}
                                            defaultItems={countries}
                                            selectedKey={field.value ?? null}
                                            isInvalid={Boolean(fieldState.error)}
                                            errorMessage={fieldState.error?.message ?? f('region_err_ms')}
                                            inputProps={{
                                                ref: phonePrefixInputRef,
                                        classNames: { input: 'ring-0 outline-none focus:outline-none focus-visible:outline-none' },
                                            }}
                                            onBlur={field.onBlur}
                                            onSelectionChange={(key) => field.onChange(key ? String(key) : '')}>
                                            {(country: Country) => (
                                                <AutocompleteItem
                                                    key={country.name}
                                                    textValue={country.name}
                                                    className="data-[focus-visible=true]:!outline-none"
                                                    startContent={
                                                        <Avatar
                                                            alt={country.name}
                                                            className="w-6 h-6"
                                                            src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                                                        />
                                                    }>
                                                    {country.name}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                    )}
                                />
                                <Input
                                    isRequired
                                    size='lg'
                                    color='primary'
                                    variant='bordered'
                                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                    label={f('your_name')}
                                    labelPlacement="outside"
                                    placeholder={f('your_name_placeholder')}
                                    type="text"
                                    errorMessage={f('your_name_err_ms')}
                                    {...register('name', {
                                        required: f('your_name_required'),
                                        minLength: {
                                            value: 2,
                                            message: f('your_name_min_length'),
                                        },
                                    })}
                                />
                                <Input
                                    isRequired
                                    size='lg'
                                    color='primary'
                                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                    variant='bordered'
                                    label={f('position')}
                                    labelPlacement="outside"
                                    placeholder={f('position_placeholder')}
                                    type="text"
                                    errorMessage={f('position_err_ms')}
                                    {...register('position', {
                                        required: f('position_required')
                                    })}
                                />
                                <Input
                                    isRequired
                                    size='lg'
                                    label={f('email')}
                                    color='primary'
                                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                    variant='bordered'
                                    labelPlacement="outside"
                                    placeholder={f('email_placeholder')}
                                    type="email"
                                    errorMessage={f('email_err_ms')}
                                    {...register('email', {
                                        required: f('email_required'),
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: f('email_required_pattern'),
                                        },
                                    })}
                                />
                                <div className="flex flex-col gap-1">
                                    <label>{f('phone_number')}<span className='text-danger'> *</span></label>
                                    <div className="flex gap-2">
                                        {/* Prefix Select */}
                                        <Controller

                                            name="phonePrefix"
                                            control={control}
                                            rules={{ required: true }}

                                            render={({ field }) => (
                                                <Autocomplete
                                                    size="lg"
                                                    color='primary'
                                                    variant='bordered'
                                                    aria-label="Phone Prefix"
                                                    className="max-w-[150px]"
                                                    // The trigger stays narrow, but the list needs room for the
                                                    // country names that make it searchable.
                                                    popoverProps={{ classNames: { content: 'min-w-[280px]' } }}
                                                    // Opening puts the caret after the chosen code, so typing a country
                                                    // name appends instead of landing in the middle of the digits.
                                                    onOpenChange={(isOpen) => isOpen && moveCaretToEnd(phonePrefixInputRef.current)}
                                                    defaultItems={phonePrefixes}
                                                    defaultFilter={phonePrefixFilter}
                                                    selectedKey={field.value ?? null}
                                                    onSelectionChange={(key) => {
                                                        if (key === null) return;
                                                        field.onChange(String(key));
                                                    }}
                                                    inputProps={{
                                                        ref: phonePrefixInputRef,
                                            classNames: { input: 'ring-0 outline-none focus:outline-none focus-visible:outline-none' },
                                                    }}>
                                                    {(prefix: PhonePrefix) => (
                                                        <AutocompleteItem
                                                            key={prefix.dial_code}
                                                            textValue={prefix.dial_code}
                                                            className="data-[focus-visible=true]:!outline-none"
                                                            startContent={
                                                                <Avatar
                                                                    alt={prefix.names[0]}
                                                                    className="w-6 h-6"
                                                                    src={`https://flagcdn.com/${prefix.code.toLowerCase()}.svg`}
                                                                />
                                                            }>
                                                            {phonePrefixLabel(prefix)}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                            )} />
                                        <Input
                                            id="phone"
                                            color='primary'
                                            variant='bordered'
                                            classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                            isRequired
                                            size='lg'
                                            placeholder="123 456 789"
                                            type="tel"
                                            isInvalid={!!errors.phoneNumber}
                                            {...register('phoneNumber', {
                                                required: f('phone_number_required'),
                                                pattern: {
                                                    value: /^[0-9\s\-]+$/,
                                                    message: f('phone_number_required_pattern'),
                                                },
                                            })}
                                        />
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                        {/* Card Payment Terms */}
                        <motion.div
                            className=" bg-white rounded-3xl lg:rounded-[50px] min-h-72 p-8 lg:p-10 mb-8"
                            variants={fadeUpItem}>
                            <h2 className="text-2xl lg:text-3xl text-primary mb-16">
                                {t('payment_terms')}<span className='text-danger'> *</span>
                            </h2>
                            <Controller
                                name="paymentTerms"
                                control={control}
                                rules={{ required: f('payment_terms_required') }}
                                render={({ field }) => (
                                    <RadioGroup
                                        isRequired
                                        orientation="horizontal"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        isInvalid={!!errors.paymentTerms}
                                        errorMessage={errors.paymentTerms?.message}>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 w-full'>
                                            <CustomRadio description="Telegraphic Transfer" value="TT">
                                                <span className='font-semibold text-base'>TT</span>
                                            </CustomRadio>
                                            <CustomRadio description="Letter of Credit" value="LC">
                                                <span className='font-semibold text-base'>LC</span>
                                            </CustomRadio>
                                            <CustomRadio description="Documentary Letter of Credit" value="DLC">
                                                <span className='font-semibold text-base'>DLC</span>
                                            </CustomRadio>
                                            <CustomRadio description="Standby Letter of Credit" value="SBLC">
                                                <span className='font-semibold text-base'>SBLC</span>
                                            </CustomRadio>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </motion.div>
                        {/* Card Shipping Details */}
                        <motion.div className=" bg-white rounded-3xl lg:rounded-[50px] min-h-72 p-8 lg:p-10 mb-8"
                            variants={fadeUpItem}>
                            <h2 className="text-2xl lg:text-3xl text-primary mb-16">
                                {t('shipping_details')}<span className='text-danger'> *</span>
                            </h2>
                            <Input
                                isRequired
                                color='primary'
                                variant='bordered'
                                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                label={f('destination_port')}
                                size='lg'
                                className='mb-5'
                                labelPlacement="outside"
                                placeholder={f('destination_port_placeholder')}
                                type="text"
                                errorMessage={f('destination_port_err_ms')}
                                {...register('destinationPort', {
                                    required: f('destination_port_required'),
                                })}
                            />
                            <Controller
                                name="incoterms"
                                control={control}
                                rules={{ required: f('incoterms_required') }}
                                render={({ field }) => (
                                    <RadioGroup
                                        isRequired
                                        label={f('incoterms')}
                                        orientation="horizontal"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        isInvalid={!!errors.incoterms}
                                        errorMessage={errors.incoterms?.message}
                                        classNames={{ label: 'text-base text-primary mb-1' }}>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 w-full'>
                                            <CustomRadio description="Cost, Insurance, and Freight" value="CIF">
                                                <span className='font-semibold text-base'>CIF</span>
                                            </CustomRadio>
                                            <CustomRadio description="Free on Board" value="FOB">
                                                <span className='font-semibold text-base'>FOB</span>
                                            </CustomRadio>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </motion.div>
                        {/* Card Contact Message */}
                        <motion.div
                            className=" bg-white rounded-3xl lg:rounded-[50px] min-h-72 p-8 lg:p-10"
                            variants={fadeUpItem}>
                            <h2 className="text-2xl lg:text-3xl text-primary mb-16">{t('contact_message')}</h2>
                            <Input
                                isRequired
                                color='primary'
                                variant='bordered'
                                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                label={f('subject')}
                                size='lg'
                                labelPlacement="outside"
                                placeholder={f('subject_placeholder')}
                                type="text"
                                errorMessage={f('subject_err_ms')}
                                {...register('subject', {
                                    required: 'Company name is required',
                                })}
                            />
                            <Textarea
                                isRequired
                                color='primary'
                                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                label={f('message')}
                                variant='bordered'
                                className='mt-10'
                                minRows={15}
                                size='lg'
                                labelPlacement="outside"
                                {...register('message', {
                                    required: f('message_required'),
                                })}
                                placeholder={f('message_placeholder')}
                                errorMessage={f('message_err_ms')}
                            />
                        </motion.div>
                    </motion.div>
                    <motion.div className="col-span-12 w-full​  lg:col-span-5 "
                        variants={fadeUpItem}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        {/* Card Products Details */}
                        <Card fullWidth className="rounded-[25px] sm:rounded-[30px] lg:rounded-[50px] min-h-[60vh] p-3 sm:p-5 xl:p-10 sticky top-28" shadow='none'>
                            <CardHeader className="flex-col items-start ">
                                <h2 className="text-2xl lg:text-3xl text-primary">{t('product_details')}</h2>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2 ">

                                {state.items.length === 0 ? (
                                    <div className='my-auto transition-all duration-300'>
                                        <CartEmpty size={200} title="Your products is empty" />
                                    </div>
                                ) : (
                                    state.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-center justify-between py-5 gap-2transition-all duration-300 ${idx !== state.items.length - 1 ? 'border-b' : ''}`}>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-3 sm:gap-5'>
                                                    <div className='relative overflow-hidden rounded-2xl xl:rounded-3xl h-24 min-w-24 lg:h-32 lg:min-w-32 select-none'>
                                                        <Image
                                                            src={item.image || ''}
                                                            alt={item.name}
                                                            fill
                                                            quality={50} className='object-cover' />
                                                        <div className="absolute inset-0 bg-black/5" />
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <div className='mb-3 lg:mb-5 lg:space-y-1'>
                                                            <h2 className="font-medium text-base  lg:text-xl text-primary">{item.name}</h2>
                                                            <p className="text-xs font-semibold text-gray-500">{t('unit')}: {item.variation?.summary || FALLBACK_VARIATION_SUMMARY}</p>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <StepperButton
                                                                size='xxs'
                                                                color='default'
                                                                aria-label="close"
                                                                radius="full"
                                                                isDisabled={item.quantity === 1}
                                                                onPress={() => {
                                                                    dispatch({
                                                                        type: 'UPDATE_QUANTITY',
                                                                        payload: { id: item.id, quantity: Math.max(item.quantity - 1, 1) },
                                                                    })
                                                                }}>
                                                                <FiMinus className="text-primary" />
                                                            </StepperButton>
                                                            <span className="px-2 select-none min-w-8 xl:min-w-10 text-center font-mono text-base xl:text-xl font-normal">{item.quantity}</span>
                                                            <StepperButton
                                                                isDisabled={item.quantity === 100}
                                                                size="xxs"
                                                                isIconOnly
                                                                color='default'
                                                                aria-label="close"
                                                                radius="full"
                                                                onPress={() => {
                                                                    dispatch({
                                                                        type: 'UPDATE_QUANTITY',
                                                                        payload: { id: item.id, quantity: item.quantity + 1 },
                                                                    })
                                                                }}>
                                                                <FiPlus className="text-primary" />
                                                            </StepperButton>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <button
                                                type='button'
                                                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                                                className="text-red-500 mt-3">
                                                <RiDeleteBin6Line size={typeof window !== "undefined" && window.innerWidth < 1024 ? 15 : 18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </CardBody>
                            {!state.isEmpty && (
                                <CardFooter>
                                    <div className='w-full mt-10'>
                                        <Button
                                            isLoading={isPending}
                                            isDisabled={isPending}
                                            color="primary"
                                            type='submit'
                                            size='lg'
                                            className='w-full text-white font-mono !font-normal tracking-wider'>
                                            {isPending ? t('sending') : t('send_request_quotation')}
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>

                    </motion.div>
                </div>
            </Form>

        </div>
    )
}

export default QuotationsPageContent


export const CustomRadio = (props: React.ComponentProps<typeof Radio>) => {
    const {
        Component,
        children,
        description,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);

    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "group inline-flex items-center justify-between flex-row-reverse tap-highlight-transparent",
                "w-full max-w-[700px] cursor-pointer border-2 border-default rounded-2xl gap-4 p-4",
                "hover:opacity-70 active:opacity-50",
                "transition-all duration-300 ease-in-out",
                "data-[selected=true]:border-primary"
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <span {...getWrapperProps()}>
                <span {...getControlProps()} />
            </span>
            <div {...getLabelWrapperProps()}>
                {children && <span {...getLabelProps()}>{children}</span>}
                {description && (
                    <span className="text-sm font-medium text-foreground opacity-70 transition-opacity duration-300 ease-in-out">{description}</span>
                )}
            </div>
        </Component>
    );
};