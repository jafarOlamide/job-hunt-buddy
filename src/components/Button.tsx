import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "success" | "danger" | "secondary"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1 px-2 text-xs",
  md: "py-2 px-3 text-sm",
  lg: "py-3 px-4 text-base"
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded transition-colors duration-200 flex items-center justify-center gap-2"
  const widthStyles = fullWidth ? "w-full" : ""
  const disabledStyles =
    disabled || loading ? "opacity-50 cursor-not-allowed" : ""

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyles}
    ${disabledStyles}
    ${className}
  `.trim()

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
