import * as React from "react"
import { cn } from "../../lib/utils"
import { Eye, EyeOff } from "lucide-react"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const isPasswordType = type === "password"

  const inputType = isPasswordType && showPassword ? "text" : type

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative flex items-center">
      <input
        type={inputType}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {isPasswordType && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
})

Input.displayName = "Input"

export { Input }