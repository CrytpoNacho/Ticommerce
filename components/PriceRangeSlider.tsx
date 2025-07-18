"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import * as Slider from "@radix-ui/react-slider"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  step?: number
  onChange: (value: [number, number]) => void
  className?: string
}

export default function PriceRangeSlider({ min, max, value, step = 100, onChange, className }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const [minInputValue, setMinInputValue] = useState<string>(value[0].toString())
  const [maxInputValue, setMaxInputValue] = useState<string>(value[1].toString())
  const [isDragging, setIsDragging] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar el valor local con el valor de las props
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value)
      setMinInputValue(value[0].toString())
      setMaxInputValue(value[1].toString())
      setHasChanges(false)
    }
  }, [value, isDragging])

  // Verificar si hay cambios pendientes
  useEffect(() => {
    const currentMin = Number.parseInt(minInputValue, 10) || min
    const currentMax = Number.parseInt(maxInputValue, 10) || max
    const hasChanges = currentMin !== value[0] || currentMax !== value[1]
    setHasChanges(hasChanges)
  }, [minInputValue, maxInputValue, value, min, max])

  // Cleanup del timer de debounce
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const debouncedOnChange = (newValue: [number, number]) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue)
      setIsDragging(false)
      setHasChanges(false)
    }, 800) // 800ms debounce para dar tiempo al usuario
  }

  const handleSliderChange = (newValue: number[]) => {
    const typedValue: [number, number] = [newValue[0], newValue[1]]
    setLocalValue(typedValue)
    setMinInputValue(typedValue[0].toString())
    setMaxInputValue(typedValue[1].toString())
    setIsDragging(true)
    debouncedOnChange(typedValue)
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, "") // Solo permitir números
    setMinInputValue(inputValue)
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, "") // Solo permitir números
    setMaxInputValue(inputValue)
  }

  const validateAndApplyValues = () => {
    let newMin = Number.parseInt(minInputValue, 10)
    let newMax = Number.parseInt(maxInputValue, 10)

    // Validar el valor mínimo
    if (isNaN(newMin)) {
      newMin = min
    } else {
      newMin = Math.max(min, Math.min(newMin, max))
    }

    // Validar el valor máximo
    if (isNaN(newMax)) {
      newMax = max
    } else {
      newMax = Math.min(max, Math.max(newMax, min))
    }

    // Asegurar que min <= max
    if (newMin > newMax) {
      const temp = newMin
      newMin = newMax
      newMax = temp
    }

    // Asegurar que hay una diferencia mínima
    if (newMax - newMin < step) {
      if (newMin + step <= max) {
        newMax = newMin + step
      } else {
        newMin = newMax - step
      }
    }

    const newValue: [number, number] = [newMin, newMax]
    setLocalValue(newValue)
    setMinInputValue(newMin.toString())
    setMaxInputValue(newMax.toString())
    setHasChanges(false)
    onChange(newValue)
  }

  const handleMinInputBlur = () => {
    // Solo validar visualmente, no aplicar cambios automáticamente
    const newMin = Number.parseInt(minInputValue, 10)
    if (isNaN(newMin)) {
      setMinInputValue(localValue[0].toString())
    }
  }

  const handleMaxInputBlur = () => {
    // Solo validar visualmente, no aplicar cambios automáticamente
    const newMax = Number.parseInt(maxInputValue, 10)
    if (isNaN(newMax)) {
      setMaxInputValue(localValue[1].toString())
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndApplyValues()
    }
  }

  const handleConfirmClick = () => {
    validateAndApplyValues()
  }

  return (
    <div className={cn("w-full px-2", className)}>
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center h-5"
        value={localValue}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        aria-label="Rango de precio"
      >
        <Slider.Track className="relative h-2 w-full grow rounded-full bg-mist bg-opacity-20">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md hover:bg-primary hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Precio mínimo"
        />
        <Slider.Thumb
          className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md hover:bg-primary hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Precio máximo"
        />
      </Slider.Root>

      <div className="flex items-center justify-between mt-4">
        <div className="bg-background border border-mist border-opacity-20 rounded-md px-2 py-1 flex items-center">
          <span className="text-sm mr-1">₡</span>
          <input
            type="text"
            value={minInputValue}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-20 bg-transparent focus:outline-none text-sm"
            aria-label="Precio mínimo"
            placeholder="0"
          />
        </div>
        <div className="bg-background border border-mist border-opacity-20 rounded-md px-2 py-1 flex items-center">
          <span className="text-sm mr-1">₡</span>
          <input
            type="text"
            value={maxInputValue}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-20 bg-transparent focus:outline-none text-sm"
            aria-label="Precio máximo"
            placeholder="1000000"
          />
        </div>
      </div>

      {/* Botón de confirmar - solo aparece cuando hay cambios */}
      {hasChanges && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleConfirmClick}
            size="sm"
            className="bg-primary text-background hover:bg-primary-dark flex items-center gap-2 px-4 py-2"
          >
            <Search size={14} />
            Aplicar filtro de precio
          </Button>
        </div>
      )}

      {/* Indicador de cambios pendientes */}
      {hasChanges && (
        <div className="mt-2 text-center">
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            Presiona Enter o el botón para aplicar los cambios
          </span>
        </div>
      )}
    </div>
  )
}
