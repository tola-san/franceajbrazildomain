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

export default function ContactForm() {
    const t = useTranslations('contact_page')
    const f = useTranslations('form')
    const [countries, setCountries] = useState<Country[]>([]);
    // Dial codes are shared by several countries, so the picker lists each
    // code once and searches across every country name using it.
    const phonePrefixes = useMemo(() => buildPhonePrefixes(countries), [countries]);
    const phonePrefixInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending, isSuccess, isError, error } = useSendEmail()
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




    const onSubmit = (data: EmailForm) => {
        mutate(data, {
            onSuccess: () => {
                reset()
                addToast({
                    title: " Message Sent Successfully!",
                    description: "Thank you for contacting us. We’ve received your message and will get back to you as soon as possible.",
                    color: "primary",
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

    return (
        <Form
            className="w-full flex flex-col gap-7"
            onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-10 w-full'>
                <Input
                    isRequired
                    label={f('company_name')}
                    size='lg'
                    labelPlacement="outside"
                    placeholder={f('company_name_placeholder')}
                    type="text"
                    errorMessage={f('company_name_err_ms')}
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
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
                            label={f('region')}
                            size="lg"
                            labelPlacement="outside"
                            placeholder={f('region_placeholder')}
                            defaultItems={countries}
                            selectedKey={field.value ?? null}
                            isInvalid={Boolean(fieldState.error)}
                            errorMessage={fieldState.error?.message ?? "Please enter a valid region"}
                            inputProps={{
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
                    label={f('your_name')}
                    labelPlacement="outside"
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
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
                    label={f('position')}
                    labelPlacement="outside"
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
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
                    labelPlacement="outside"
                    classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
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
                    <label>{f('phone_number')} <span className='text-danger'> *</span></label>
                    <div className="flex gap-2">
                        {/* Prefix Select */}
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
                            )}
                        />
                        {/* Phone Number Input */}
                        <Input
                            id="phone"
                            isRequired
                            size='lg'
                            classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
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

            <Input
                isRequired
                label={f('subject')}
                size='lg'
                className='mt-5'
                labelPlacement="outside"
                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                placeholder={f('subject_placeholder')}
                type="text"
                errorMessage={f('subject_err_ms')}
                {...register('subject', {
                    required: f('subject_required'),
                })}
            />
            <Textarea
                label={f('message')}
                isRequired
                minRows={15}
                size='lg'
                labelPlacement="outside"
                classNames={{ input: 'ring-0 outline-0 border-0 focus:outline-none' }}
                {...register('message', {
                    required: f('message_required'),
                })}
                placeholder={f('message_placeholder')}
                errorMessage={f('message_err_ms')}
            />


            <div className="flex gap-2 z-50 mt-10">
                <Button color="primary" type="submit" size='lg' className='text-white font-mono tracking-wider' isLoading={isPending} isDisabled={isPending}>
                    {isPending ? f('sending') : f('send_message')}
                </Button>
                <Button type="button" size='lg' className='font-mono tracking-wider' variant="flat" onPress={() => reset()} isDisabled={isPending}>
                    {f('reset')}
                </Button>
            </div>
        </Form>
    );
}
