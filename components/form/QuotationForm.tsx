'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, AutocompleteItem, Form, Input, Button, Textarea, Avatar } from '@heroui/react';
import {
    buildPhonePrefixes,
    makePhonePrefixFilter,
    moveCaretToEnd,
    phonePrefixLabel,
    PhonePrefix,
} from '@/lib/phone-prefixes';
import { EmailForm } from '@/types/contact';
import useSendEmail from '@/hooks/useSendEmail';


type Country = {
    name: string;
    dial_code: string;
    code: string;
};

export default function QuotationForm() {
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
            onSuccess: () => reset(),
        })
    };

    return (
        <Form
            className="w-full flex flex-col gap-7"
            onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-10 w-full'>
                <Input
                    isRequired
                    label="Company Name"
                    size='lg'
                    labelPlacement="outside"
                    placeholder="Enter a company name"
                    type="text"
                    errorMessage="Please enter a valid company name"
                    {...register('companyName', {
                        required: 'Company name is required',
                    })}
                />
                <Controller
                    control={control}
                    name="region"
                    rules={{ required: 'Region is required' }}
                    render={({ field, fieldState }) => (
                        <Autocomplete
                            isRequired
                            // Surface react-hook-form's message inline instead of the
                            // browser's native required bubble.
                            validationBehavior="aria"
                            label="Region"
                            size="lg"
                            labelPlacement="outside"
                            placeholder="Select a region"
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
                    label="Your Name"
                    labelPlacement="outside"
                    placeholder="Enter your name"
                    type="text"
                    errorMessage="Please enter a valid your name"
                    {...register('name', {
                        required: 'Your name is required',
                        minLength: {
                            value: 2,
                            message: 'Username must be at least 2 characters',
                        },
                    })}
                />
                <Input
                    isRequired
                    size='lg'
                    label="Position"
                    labelPlacement="outside"
                    placeholder="Enter position"
                    type="text"
                    errorMessage="Please enter a valid position"
                    {...register('position', {
                        required: 'Position is required',
                        minLength: {
                            value: 2,
                            message: 'Username must be at least 2 characters',
                        },
                    })}
                />
                <Input
                    isRequired
                    size='lg'
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    type="email"
                    errorMessage="Please enter a valid email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format',
                        },
                    })}
                />
                <div className="flex flex-col gap-1">
                    <label>Phone Number <span className='text-danger'> *</span></label>
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
                            placeholder="123 456 789"
                            type="tel"
                            isInvalid={!!errors.phoneNumber}
                            {...register('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9\s\-]+$/,
                                    message: 'Only digits, spaces, and dashes allowed',
                                },
                            })}
                        />
                    </div>
                </div>
            </div>

            <Input
                isRequired
                label="Subject"
                size='lg'
                className='mt-5'
                labelPlacement="outside"
                placeholder="Enter a subject"
                type="text"
                errorMessage="Please enter a valid subject"
                {...register('subject', {
                    required: 'Company name is required',
                })}
            />
            <Textarea
                label="Message"
                isRequired
                minRows={15}
                size='lg'
                labelPlacement="outside"
               {...register('message', {
                    required: 'Message is required',
                })}
                placeholder="Enter your description"
                errorMessage="Please enter a valid message"
            />


            <div className="flex gap-2 z-50 mt-10">
                <Button color="primary" type="submit" className='text-white font-mono tracking-wider' isLoading={isSubmitting}  disabled={isPending}>
                     {isPending ? 'Sending...' : 'Send Message'}
                </Button>
                <Button type="button" className='font-mono tracking-wider' variant="flat" onPress={() => reset()}  disabled={isPending}>
                    Reset
                </Button>
            </div>
        </Form>
    );
}
