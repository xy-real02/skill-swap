import Link from 'next/link'

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}) {
  const baseStyles = "font-label-md text-label-md py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
  
  let variantStyles = ""
  switch (variant) {
    case 'primary':
      variantStyles = "bg-primary text-on-primary hover:bg-primary/90 shadow-sm"
      break
    case 'outline':
      variantStyles = "bg-transparent text-primary border-[1.5px] border-primary hover:bg-secondary-container/20"
      break
    case 'ghost':
      variantStyles = "bg-transparent text-on-surface-variant hover:bg-surface-variant/30"
      break
    case 'danger':
      variantStyles = "bg-transparent text-error border-[1.5px] border-outline-variant hover:border-error hover:bg-error-container/20"
      break
  }

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
  
  const combinedClassName = `${baseStyles} ${variantStyles} ${disabledStyles} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClassName}>
      {children}
    </button>
  )
}
