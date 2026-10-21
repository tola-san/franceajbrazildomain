"use client";

import { Button, Checkbox, CheckboxGroup } from "@heroui/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type SortKey = "default" | "a-z" | "z-a";

type Category = { key: string; label: string };

type Props = {
  // data
  categories?: Category[];
  uniqueTags: string[];

  // state
  selectedSort: SortKey;
  setSelectedSort: (v: SortKey) => void;

  selectedLimit: string;
  setSelectedLimit: (v: string) => void;

  categoriesSelected: string[];
  setCategoriesSelected: (v: string[]) => void;

  tagsSelected: string[];
  setTagsSelected: (v: string[]) => void;

  // called after any filter changes to reset pagination to page 1
  onRequestFirstPage: () => void;
};

export default function ProductsFiltersClient({
  categories = [],
  uniqueTags = [],
  selectedSort,
  setSelectedSort,
  selectedLimit,
  setSelectedLimit,
  categoriesSelected,
  setCategoriesSelected,
  tagsSelected,
  setTagsSelected,
  onRequestFirstPage,
}: Props) {
  const f = useTranslations("filter");
  const c = useTranslations("categories");

  const sorts: SortKey[] = useMemo(() => ["default", "a-z", "z-a"], []);
  const limits = useMemo(() => ["24", "48", "96"] as const, []);

  const humanizeTag = (tag: string) =>
    tag.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

  return (
    <div className="w-[400px] sticky top-24 flex flex-col gap-y-5">
      {/* Sort / Limit */}
      <div className="bg-white rounded-[30px] xl:rounded-[50px] w-full min-h-[200px] px-8 py-8">
        <h2 className="text-primary text-2xl">{f("sort_by")}</h2>
        <div className="flex flex-wrap gap-2 mt-8">
          {sorts.map((sort) => {
            const label =
              sort === "a-z" ? "Name A to Z" : sort === "z-a" ? "Name Z to A" : "Default";
            const active = selectedSort === sort;
            return (
              <Button
                key={sort}
                size="sm"
                color={active ? "primary" : "default"}
                radius="full"
                variant="bordered"
                className={`border-1 capitalize ${active ? "bg-primary text-white" : ""}`}
                onClick={() => {
                  setSelectedSort(sort);
                  onRequestFirstPage();
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>

        <h2 className="text-primary text-2xl mt-8">Shows</h2>
        <div className="flex flex-wrap gap-2 mt-8">
          {limits.map((limit) => {
            const active = selectedLimit === limit;
            return (
              <Button
                key={limit}
                size="sm"
                color={active ? "primary" : "default"}
                radius="full"
                variant="bordered"
                className={`border-1 ${active ? "bg-primary text-white " : ""}`}
                onClick={() => {
                  setSelectedLimit(limit);
                  onRequestFirstPage();
                }}
              >
                {limit}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-white rounded-[30px] relative overflow-hidden xl:rounded-[50px] min-h-[300px] w-full ">
          <div className="p-8">
            <h2 className="text-primary text-2xl">{c("categories")}</h2>
            <CheckboxGroup
              value={categoriesSelected}
              onValueChange={(val) => {
                setCategoriesSelected(val as string[]);
                onRequestFirstPage();
              }}
              className="mt-5 text-white"
            >
              {categories.map((cat) => (
                <div key={cat.key} className="flex justify-between items-center py-1">
                  <p className="text-primary font-medium text-base capitalize">{c(cat.label)}</p>
                  <Checkbox value={cat.key} aria-label={c(cat.label)} />
                </div>
              ))}
            </CheckboxGroup>
          </div>
          <div className="relative h-[200px] w-full">
            <Image
              src="/images/france-aj-banner-meet.jpg"
              alt="HALAL meats banner — France AJ Alimentaire And Food LTDA (Food Export & Import LTDA) | B2B wholesale import & export"
              width={400}
              height={400}
              loading="lazy"
              quality={100}
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover z-10 object-top w-full h-full"
            />
            <div className="absolute top-0 h-32 inset-x-0 bg-gradient-to-b from-white via-white/75 to-transparent z-20" />
          </div>
        </div>
      )}

      {/* Tag Filters */}
      {uniqueTags.length > 0 && (
        <div className="bg-white rounded-[30px] xl:rounded-[50px] min-h-[300px] w-full relative overflow-hidden">
          <div className="p-8">
            <h2 className="text-primary text-2xl">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-8">
              {uniqueTags.slice(0, 10).map((tag) => {
                const isSelected = tagsSelected.includes(tag);
                return (
                  <Button
                    key={tag}
                    size="sm"
                    color={isSelected ? "primary" : "default"}
                    radius="full"
                    variant="bordered"
                    className={`border-1 ${isSelected ? "bg-primary text-white" : ""}`}
                    onClick={() => {
                      const updated = isSelected
                        ? tagsSelected.filter((t) => t !== tag)
                        : [...tagsSelected, tag];
                      setTagsSelected(updated);
                      onRequestFirstPage();
                    }}
                  >
                    {humanizeTag(tag)}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="relative h-[200px] w-full">
            <Image
              src="/images/france-aj-banner-meet.jpg"
              alt="Meat products banner for tags — France AJ Alimentaire And Food LTDA | HALAL beef & chicken, B2B wholesale"
              width={400}
              height={400}
              loading="lazy"
              quality={100}
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover z-10 object-top w-full h-full"
            />
            <div className="absolute top-0 h-32 inset-x-0 bg-gradient-to-b from-white via-white/75 to-transparent z-20" />
          </div>
        </div>
      )}
    </div>
  );
}
