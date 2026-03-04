import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeStyles = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-destructive text-white",
                outline: "border-border text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeStyles>;

export function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeStyles({ variant }), className)} {...props} />;
}
