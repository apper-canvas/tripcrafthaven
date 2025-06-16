const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  }
  
  const badgeClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  )
}

export default Badge