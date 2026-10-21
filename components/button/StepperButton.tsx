
import {extendVariants, Button} from "@heroui/react";

export const StepperButton = extendVariants(Button, {
  variants: {
    color: {
      olive: "text-[#000] bg-[#84cc16]",
      orange: "bg-[#ff8c00] text-[#fff]",
      violet: "bg-[#8b5cf6] text-[#fff]",
      primary: "bg-primary text-white",
      default: "bg-default-200"
    },
    isDisabled: {
      true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed",
    },
    size: {
      xxs: "px-1 py-1 h-5 text-tiny gap-1 rounded-small",
      xs: "px-2 py-2 h-7 text-tiny gap-1 rounded-small",
      md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
      small: "rounded-small",
      medium: "rounded-medium" 
    }
  },
  defaultVariants: { 
    color: "olive",
    size: "xl",
  },
  compoundVariants: [
    {
      isDisabled: true,
      color: "olive",
      class: "bg-default opacity-100",
    },
  ],
});