"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | null
  setDate: (date: Date | null) => void
  label?: string
  className?: string
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
}

export function DatePicker({
  date,
  setDate,
  label,
  className,
  placeholder = "Sélectionnez une date",
  disabled = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: fr }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={(newDate: Date | undefined) => {
              setDate(newDate || null);
            }}
            initialFocus
            locale={fr}
            fromDate={fromDate}
            toDate={toDate}
            required={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
