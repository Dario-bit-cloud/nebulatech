'use client'

import { ReactNode, forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
  showPasswordToggle?: boolean
  loading?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    showPasswordToggle = false,
    loading = false,
    type = 'text',
    className = '',
    disabled,
    ...props
  },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type

  const getVariantClasses = () => {
    const baseClasses = 'w-full transition-all duration-200 focus:outline-none'
    
    switch (variant) {
      case 'filled':
        return `${baseClasses} bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500`
      case 'outline':
        return `${baseClasses} bg-transparent border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`
      default:
        return `${baseClasses} bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
    }
  }

  const getSizeClasses = () => {
    switch (inputSize) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-4 py-4 text-base'
      default:
        return 'px-4 py-3 text-sm'
    }
  }

  const getStateClasses = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500'
    }
    if (success) {
      return 'border-green-300 focus:border-green-500 focus:ring-green-500'
    }
    return ''
  }

  const inputClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${getStateClasses()}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || showPasswordToggle || error || success ? 'pr-10' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
    rounded-xl
    ${className}
  `

  const containerClasses = `
    relative
    ${isFocused ? 'transform scale-[1.02]' : ''}
    transition-transform duration-200
  `

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <div className={containerClasses}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          disabled={disabled || loading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
          
          {!loading && error && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          
          {!loading && !error && success && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          
          {!loading && !error && !success && showPasswordToggle && type === 'password' && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          
          {!loading && !error && !success && !showPasswordToggle && rightIcon && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      
      {(error || success || helperText) && (
        <div className="space-y-1">
          {error && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          )}
          
          {success && (
            <p className="text-sm text-green-600 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </p>
          )}
          
          {helperText && !error && !success && (
            <p className="text-sm text-gray-600">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input