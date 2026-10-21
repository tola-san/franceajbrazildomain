/**
 * Card styling shared by the about page's feature grids and by the sections
 * extracted out of it for reuse elsewhere (markets, process steps). Kept in one
 * place so a clone of a section cannot drift from the original.
 */
export const sectionCardClass = "flex flex-col gap-4 bg-primary/5 rounded-[25px] lg:rounded-[35px] p-7 lg:p-8 group hover:bg-primary transition-colors duration-300";
export const sectionIconClass = "flex-shrink-0 w-12 h-12 rounded-full bg-primary group-hover:bg-white flex items-center justify-center text-white group-hover:text-primary transition-colors duration-300";
export const sectionCardTitleClass = "text-lg lg:text-xl font-normal text-primary group-hover:text-white leading-tight transition-colors duration-300";
export const sectionCardDescClass = "text-sm lg:text-base font-medium text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-300";
