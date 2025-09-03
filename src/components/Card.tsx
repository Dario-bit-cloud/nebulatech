'use client'

import { ReactNode, forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  interactive?: boolean
  loading?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>((
  {
    children,
    variant = 'default',
    padding = 'md',
    rounded = 'lg',
    shadow = 'md',
    hover = false,
    interactive = false,
    loading = false,
    className = '',
    ...props
  },
  ref
) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white border-0 shadow-xl'
      case 'outlined':
        return 'bg-white border-2 border-gray-200 shadow-none'
      case 'filled':
        return 'bg-gray-50 border border-gray-200'
      case 'glass':
        return 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg'
      default:
        return 'bg-white border border-gray-100'
    }
  }

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return ''
      case 'sm':
        return 'p-3'
      case 'lg':
        return 'p-8'
      case 'xl':
        return 'p-12'
      default:
        return 'p-6'
    }
  }

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'none':
        return ''
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'xl':
        return 'rounded-xl'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-xl'
    }
  }

  const getShadowClasses = () => {
    if (variant === 'outlined' || variant === 'glass') return ''
    
    switch (shadow) {
      case 'none':
        return 'shadow-none'
      case 'sm':
        return 'shadow-sm'
      case 'lg':
        return 'shadow-lg'
      case 'xl':
        return 'shadow-xl'
      default:
        return 'shadow-md'
    }
  }

  const getHoverClasses = () => {
    if (!hover && !interactive) return ''
    
    return 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
  }

  const getInteractiveClasses = () => {
    if (!interactive) return ''
    
    return 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95'
  }

  const baseClasses = `
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${getRoundedClasses()}
    ${getShadowClasses()}
    ${getHoverClasses()}
    ${getInteractiveClasses()}
    ${className}
  `

  if (loading) {
    return (
      <div ref={ref} className={baseClasses} {...props}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={baseClasses}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// Card Title Component
interface CardTitleProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = ({ children, className = '', as: Component = 'h3' }: CardTitleProps) => {
  return (
    <Component className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </Component>
  )
}

// Card Content Component
interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return (
    <div className={`text-gray-600 ${className}`}>
      {children}
    </div>
  )
}

// Card Footer Component
interface CardFooterProps {
  children: ReactNode
  className?: string
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card