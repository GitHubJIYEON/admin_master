import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type CalendarProps = {
  mode?: "single";
  selected?: Date;
  defaultMonth?: Date;
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
  onSelect?: (date: Date | undefined) => void;
  className?: string;
};

function formatDate(date?: Date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function Calendar({ selected, onSelect, className }: CalendarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelect?.(parseDate(event.target.value));
  };

  return (
    <div className={cn("p-3", className)}>
      <input
        type="date"
        value={formatDate(selected)}
        onChange={handleChange}
        className={cn(
          "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        )}
      />
    </div>
  );
}

export { Calendar };
