import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={cn(
            "form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900">
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }