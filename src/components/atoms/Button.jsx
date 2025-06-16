import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-white hover:bg-purple-800 focus:ring-secondary shadow-lg hover:shadow-xl',
    accent: 'bg-accent text-white hover:bg-pink-600 focus:ring-accent shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-surface-100 focus:ring-gray-300',
    gradient: 'gradient-travel text-white hover:shadow-xl focus:ring-primary'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()
  
  const iconSize = size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 20 : 18
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className={`animate-spin mr-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`mr-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`ml-2 h-${iconSize/4} w-${iconSize/4}`} />
      )}
    </motion.button>
  )
}

export default Button