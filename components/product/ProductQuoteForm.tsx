'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, AutocompleteItem, Form, Input, Button, Textarea, Avatar, addToast } from '@heroui/react';
import {
    buildPhonePrefixes,
    makePhonePrefixFilter,
    moveCaretToEnd,
    phonePrefixLabel,
    PhonePrefix,
} from '@/lib/phone-prefixes';
import { EmailForm } from '@/types/contact';
import useSendEmail from '@/hooks/useSendEmail';
import { PiSealCheckDuotone } from 'react-icons/pi';
import { useTranslations } from 'next-intl';

type Country = {
    name: string;
    dial_code: string;
    code: string;
};

interface Props {
    productName: string;
}

export default function ProductQuoteForm({ productName }: Props) {
    const t = useTranslations('product_quote');
    const f = useTranslations('form');
    const [countries, setCountries] = useState<Country[]>([]);
    // Dial codes are shared by several countries, so the picker lists each
    // code once and searches across every country name using it.
    const phonePrefixes = useMemo(() => buildPhonePrefixes(countries), [countries]);
    const phonePrefixInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useSendEmail();

    const messageTemplate = t('message_template').replace('{product}', productName);
    const subjectValue = `${t('subject_prefix')} — ${productName}`;

    const {
        register,
        watch,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<EmailForm>({
        defaultValues: {
            phonePrefix: '+1',
            subject: subjectValue,
            message: messageTemplate,
            position: 'Buyer / Procurement',
            region: '',
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
                setValue('phonePrefix', `+${geoData.calling_code}`);
                if (geoData.country) {
                    setValue('region', geoData.country);
                }
            } catch {
                // geo detection is best-effort
            }
        };
        fetchData();
    }, [setValue]);

    const onSubmit = (data: EmailForm) => {
        mutate(data, {
            onSuccess: () => {
                reset({
                    phonePrefix: '+1',
                    subject: subjectValue,
                    message: messageTemplate,
                    position: 'Buyer / Procurement',
                    region: '',
                });
                addToast({
                    title: t('success_title'),
                    description: t('success_description'),
                    color: 'primary',
                    icon: <PiSealCheckDuotone />,
                    classNames: {
                        base: 'rounded-[20px] bg-[#D2C8C3] p-3 border border-primary max-w-xl',
                        title: 'text-base font-mono text-primary line-clamp-1',
                        description: 'text-black',
                        icon: 'text-primary',
                        closeIcon: 'bg-[#D2C8C3]',
                    },
                });
            },
        });
    };

    return (
        <section className="w-full max-w-4xl mx-auto px-4 lg:px-0 py-12">
            <h2 className="text-2xl font-mono font-semibold tracking-wide text-primary mb-2">
                {t('title')}
            </h2>
            <p className="text-sm text-gray-500 mb-8">{t('description')}</p>

            <Form className="w-full flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
                {/* Hidden fields */}
                <input type="hidden" {...register('region')} />
                <input type="hidden" {...register('position')} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-10 w-full">
                    <Input
                        isRequired
                        label={f('company_name')}
                        size="lg"
                        labelPlacement="outside"
                        placeholder={f('company_name_placeholder')}
                        type="text"
                        errorMessage={errors.companyName?.message}
                        classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                        {...register('companyName', {
                            required: f('company_name_required'),
                        })}
                    />
                    <Input
                        isRequired
                        size="lg"
                        label={f('your_name')}
                        labelPlacement="outside"
                        classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                        placeholder={f('your_name_placeholder')}
                        type="text"
                        errorMessage={errors.name?.message}
                        {...register('name', {
                            required: f('your_name_required'),
                            minLength: { value: 2, message: f('your_name_min_length') },
                        })}
                    />
                    <Input
                        isRequired
                        size="lg"
                        label={f('email')}
                        labelPlacement="outside"
                        classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                        placeholder={f('email_placeholder')}
                        type="email"
                        errorMessage={errors.email?.message}
                        {...register('email', {
                            required: f('email_required'),
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: f('email_required_pattern'),
                            },
                        })}
                    />
                    <div className="flex flex-col gap-1">
                        <label>
                            {f('phone_number')} <span className="text-danger">*</span>
                        </label>
                        <div className="flex gap-2">
                            <Controller
                                name="phonePrefix"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Autocomplete
                                        size="lg"
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
                                        onSelectionChange={(key: React.Key | null) => {
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
                                )}
                            />
                            <Input
                                isRequired
                                size="lg"
                                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                                placeholder="123 456 789"
                                type="tel"
                                isInvalid={!!errors.phoneNumber}
                                errorMessage={errors.phoneNumber?.message}
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
                    <Input
                        isRequired
                        label={t('quantity_label')}
                        size="lg"
                        labelPlacement="outside"
                        placeholder={t('quantity_placeholder')}
                        type="text"
                        errorMessage={errors.paymentTerms?.message}
                        classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                        {...register('paymentTerms', {
                            required: t('quantity_required'),
                        })}
                    />
                    <Input
                        label={t('destination_label')}
                        size="lg"
                        labelPlacement="outside"
                        placeholder={t('destination_placeholder')}
                        type="text"
                        classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                        {...register('destinationPort')}
                    />
                </div>

                <Input
                    isRequired
                    label={f('subject')}
                    size="lg"
                    className="mt-5"
                    labelPlacement="outside"
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                    placeholder={f('subject_placeholder')}
                    type="text"
                    errorMessage={errors.subject?.message}
                    {...register('subject', {
                        required: f('subject_required'),
                    })}
                />
                <Textarea
                    label={f('message')}
                    isRequired
                    minRows={12}
                    size="lg"
                    labelPlacement="outside"
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                    errorMessage={errors.message?.message}
                    {...register('message', {
                        required: f('message_required'),
                    })}
                />

                <div className="flex gap-2 mt-6">
                    <Button
                        color="primary"
                        type="submit"
                        size="lg"
                        className="text-white font-mono tracking-wider"
                        isLoading={isPending}
                        isDisabled={isPending}>
                        {isPending ? t('submitting') : t('submit')}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        className="font-mono tracking-wider"
                        variant="flat"
                        onPress={() =>
                            reset({
                                phonePrefix: '+1',
                                subject: subjectValue,
                                message: messageTemplate,
                                position: 'Buyer / Procurement',
                                region: '',
                            })
                        }
                        isDisabled={isPending}>
                        {t('reset')}
                    </Button>
                </div>
            </Form>
        </section>
    );
}
