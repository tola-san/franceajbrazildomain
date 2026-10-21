"use client"

import { useMemo, useState } from "react";
import { Autocomplete, AutocompleteItem, NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import {
    buildVariationSummary,
    getDefaultSelection,
    getMinContainers,
    getWeightUnit,
    normalizeQuantity,
    normalizeWeight,
    parseTonnage,
    toCartVariation,
    VariationSelection,
} from "@/lib/products/variation";
import ProductAddToCartButton from "./ProductAddToCartButton";
import ProductContactQuoteButton from "./ProductContactQuoteButton";

interface Props {
    data: Product;
}

/**
 * The "Request Options" panel: packaging / container / tonnage selectors shown
 * directly above the quote actions, plus the actions themselves — they live together because the
 * buttons carry the current selection into the cart and the WhatsApp message.
 *
 * Goods quoted by tonnage (grain, sugar, fertilizer, oil) offer a tonnage the
 * buyer either picks from the catalog presets or types in themselves, starting
 * at the minimum order; goods sold by the container (meat) choose a container
 * count instead. The container loading (20ft / 40ft) is offered wherever the
 * catalog lists one, so oil pairs it with a tonnage.
 */
const ProductOrderOptions = ({ data }: Props) => {
    const tv = useTranslations('product_variation');
    const { id, name, images, imagesAlt, slug, category, variation } = data;

    const [selection, setSelection] = useState<VariationSelection>(() =>
        getDefaultSelection(variation),
    );
    // How many containers the buyer wants. This is an order quantity, not a
    // product attribute, so it lives in component state only (never in the
    // catalog) and is carried over as the cart line's quantity. Meat ships
    // from five containers up, so the field starts at the category minimum.
    const minContainers = getMinContainers(category);
    const [containers, setContainers] = useState(minContainers);

    const update = (patch: Partial<VariationSelection>) =>
        setSelection((prev) => ({ ...prev, ...patch }));

    const cartVariation = useMemo(
        () => toCartVariation(selection, variation),
        [selection, variation],
    );

    const summary = useMemo(
        () => buildVariationSummary(selection, variation),
        [selection, variation],
    );

    const isBulk = (variation?.quantities?.length ?? 0) > 0;
    // The first catalog entry is the minimum order; a typed-in quantity below
    // it is flagged so the buyer fixes it before requesting the quote.
    const minOrder = variation?.quantities?.[0];
    const minTonnage = parseTonnage(minOrder);
    const typedTonnage = parseTonnage(selection.quantity);
    const isBelowMinimum =
        isBulk &&
        minTonnage !== undefined &&
        typedTonnage !== undefined &&
        typedTonnage < minTonnage;
    // Anything not sold as bulk tonnage ships by the container.
    const showContainerCount = !isBulk;
    const hasFields =
        showContainerCount ||
        (variation?.packages?.length ?? 0) > 0 ||
        (variation?.weights?.length ?? 0) > 0 ||
        (variation?.containerTypes?.length ?? 0) > 0 ||
        isBulk;

    // Both comboboxes drop the browser's native focus ring — the bordered
    // wrapper already shows focus.
    const comboboxInputClassNames = {
        label: "text-primary font-medium",
        input: "ring-0 outline-none focus:outline-none focus-visible:outline-none",
    };

    // Options keep their hover/selected highlight but lose the browser's blue
    // focus outline, matching the comboboxes.
    const optionClassName = "data-[focus-visible=true]:!outline-none";

    const selectClassNames = {
        label: "text-primary font-medium",
        trigger: "bg-white border-primary/40 data-[hover=true]:border-primary",
        value: "text-primary",
    };

    return (
        // The purchase region of the product article: selectors plus the two
        // quote actions. Labelled rather than heading-linked because the panel
        // (and its heading) disappears for goods with no options to pick.
        <section aria-label={tv('title')} className="mt-10">
            {hasFields && (
                <div className="rounded-[20px] lg:rounded-[30px] border border-primary/20 p-5 lg:p-6">
                    <h2 className="text-base lg:text-lg text-primary mb-5">{tv('title')}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8">
                        {(variation?.packages?.length ?? 0) > 0 && (
                            <Autocomplete
                                allowsCustomValue
                                size="lg"
                                radius="lg"
                                variant="bordered"
                                color="primary"
                                // Buyers often need a packing the catalog does
                                // not list, so the note spells out that the
                                // presets can be typed over.
                                label={
                                    <span className="flex flex-wrap items-baseline gap-x-2">
                                        {tv('package_label')}
                                        <span className="text-xs font-normal text-primary/60">
                                            {tv('custom_value_note')}
                                        </span>
                                    </span>
                                }
                                labelPlacement="outside"
                                placeholder={tv('package_placeholder')}
                                inputValue={selection.package ?? ''}
                                selectedKey={
                                    variation?.packages?.includes(selection.package ?? '')
                                        ? selection.package
                                        : null
                                }
                                inputProps={{ classNames: comboboxInputClassNames }}
                                onInputChange={(value) => update({ package: value })}
                                onSelectionChange={(key) =>
                                    key !== null && update({ package: String(key) })
                                }
                                // An empty box falls back to the first preset so
                                // the quote never goes out without a packing.
                                onBlur={() =>
                                    update({
                                        package:
                                            selection.package?.trim() || variation?.packages?.[0],
                                    })
                                }>
                                {(variation?.packages ?? []).map((option) => (
                                    <AutocompleteItem key={option} className={optionClassName}>{option}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                        )}

                        {(variation?.weights?.length ?? 0) > 0 && (
                            <Autocomplete
                                allowsCustomValue
                                size="lg"
                                radius="lg"
                                variant="bordered"
                                color="primary"
                                label={
                                    <span className="flex flex-wrap items-baseline gap-x-2">
                                        {tv(
                                            variation?.weightLabel === 'chicken'
                                                ? 'weight_label_chicken'
                                                : 'weight_label',
                                        )}
                                        <span className="text-xs font-normal text-primary/60">
                                            {tv('custom_value_note')}
                                        </span>
                                    </span>
                                }
                                labelPlacement="outside"
                                placeholder={tv('weight_placeholder')}
                                inputValue={selection.weight ?? ''}
                                selectedKey={
                                    variation?.weights?.includes(selection.weight ?? '')
                                        ? selection.weight
                                        : null
                                }
                                inputProps={{ classNames: comboboxInputClassNames }}
                                onInputChange={(value) => update({ weight: value })}
                                onSelectionChange={(key) =>
                                    key !== null && update({ weight: String(key) })
                                }
                                // Tidy a typed weight once the buyer moves on,
                                // e.g. "12" becomes "12 kg" — or "900" becomes
                                // "900 g" where the catalog quotes grams.
                                onBlur={() =>
                                    update({
                                        weight:
                                            normalizeWeight(
                                                selection.weight,
                                                getWeightUnit(variation),
                                            ) ?? variation?.weights?.[0],
                                    })
                                }>
                                {(variation?.weights ?? []).map((option) => (
                                    <AutocompleteItem key={option} className={optionClassName}>{option}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                        )}

                        {(variation?.containerTypes?.length ?? 0) > 0 && (
                            <Select
                                disallowEmptySelection
                                size="lg"
                                radius="lg"
                                variant="bordered"
                                color="primary"
                                label={tv('container_loading_label')}
                                labelPlacement="outside"
                                classNames={selectClassNames}
                                selectedKeys={
                                    selection.containerType ? [selection.containerType] : []
                                }
                                onSelectionChange={(keys) =>
                                    update({ containerType: Array.from(keys)[0] as string })
                                }>
                                {(variation?.containerTypes ?? []).map((option) => (
                                    <SelectItem key={option} className={optionClassName}>{option}</SelectItem>
                                ))}
                            </Select>
                        )}

                        {isBulk && (
                            <Autocomplete
                                allowsCustomValue
                                size="lg"
                                radius="lg"
                                variant="bordered"
                                color="primary"
                                // The minimum-order hint rides along with the label
                                // instead of sitting under the field, so it reads
                                // before the buyer starts typing.
                                label={
                                    <span className="flex flex-wrap items-baseline gap-x-2">
                                        {tv('quantity_label')}
                                        <span className="text-xs font-normal text-primary/60">
                                            {tv('min_order_note', { min: minOrder ?? '' })}
                                        </span>
                                    </span>
                                }
                                labelPlacement="outside"
                                placeholder={tv('quantity_placeholder')}
                                inputValue={selection.quantity ?? ''}
                                selectedKey={
                                    variation?.quantities?.includes(selection.quantity ?? '')
                                        ? selection.quantity
                                        : null
                                }
                                isInvalid={isBelowMinimum}
                                errorMessage={tv('min_order_error', { min: minOrder ?? '' })}
                                inputProps={{ classNames: comboboxInputClassNames }}
                                onInputChange={(value) => update({ quantity: value })}
                                onSelectionChange={(key) =>
                                    key !== null && update({ quantity: String(key) })
                                }
                                // Tidy a typed quantity once the buyer moves on,
                                // e.g. "18000" becomes "18,000 MT".
                                onBlur={() =>
                                    update({
                                        quantity:
                                            normalizeQuantity(selection.quantity) ?? minOrder,
                                    })
                                }>
                                {(variation?.quantities ?? []).map((option) => (
                                    <AutocompleteItem key={option} className={optionClassName}>{option}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                        )}

                        {showContainerCount && (
                            <NumberInput
                                size="lg"
                                radius="lg"
                                variant="bordered"
                                color="primary"
                                // Like the bulk minimum-order hint, the
                                // container minimum rides along with the label
                                // so it reads before the buyer changes the value.
                                label={
                                    minContainers > 1 ? (
                                        <span className="flex flex-wrap items-baseline gap-x-2">
                                            {tv('containers_label')}
                                            <span className="text-xs font-normal text-primary/60">
                                                {tv('min_containers_note', { min: minContainers })}
                                            </span>
                                        </span>
                                    ) : (
                                        tv('containers_label')
                                    )
                                }
                                labelPlacement="outside"
                                minValue={minContainers}
                                step={1}
                                value={containers}
                                classNames={{
                                    label: "text-primary font-medium",
                                    input: "ring-0 outline-none focus:outline-none focus-visible:outline-none",
                                }}
                                onValueChange={(value) =>
                                    setContainers(
                                        Number.isFinite(value)
                                            ? Math.max(Math.trunc(value), minContainers)
                                            : minContainers,
                                    )
                                }
                            />
                        )}
                    </div>

                    <p className="mt-6 text-sm text-primary/70">
                        {tv('selected_label')}:{' '}
                        <span className="font-medium text-primary">
                            {showContainerCount
                                ? tv('selected_with_containers', {
                                    packing: summary,
                                    count: containers,
                                })
                                : summary}
                        </span>
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-6 flex-col sm:flex-row">
                <ProductAddToCartButton
                    id={id}
                    name={name}
                    image={images?.[0]}
                    imageAlt={imagesAlt?.[0]}
                    variation={cartVariation}
                    quantity={showContainerCount ? containers : 1}
                />
                <ProductContactQuoteButton
                    name={name}
                    slug={slug}
                    category={category}
                    variationSummary={
                        showContainerCount
                            ? tv('selected_with_containers', {
                                packing: summary,
                                count: containers,
                            })
                            : summary
                    }
                />
            </div>
        </section>
    );
};

export default ProductOrderOptions;
