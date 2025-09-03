'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: ReactNode
  color?: string
  className?: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  loading?: boolean
  onClick?: () => void
  variant?: 'default' | 'compact' | 'featured'
}

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color = 'text-gray-900', 
  className = '', 
  description, 
  trend,
  trendValue,
  loading = false,
  onClick,
  variant = 'default'
}: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4'
      case 'featured':
        return 'p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      default:
        return 'p-6'
    }
  }

  const baseClasses = `
    card hover-lift transition-all duration-300 
    ${getVariantClasses()}
    ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
    ${className}
  `

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  if (loading) {
    return (
      <div className={baseClasses}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>
          {description && (
            <div className="h-3 bg-gray-200 rounded w-full mt-4"></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={baseClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `${title}: ${value}${unit || ''}` : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${color} transition-colors duration-300`}>
              {value}
              {unit && (
                <span className="text-lg text-gray-600 ml-1 font-normal">
                  {unit}
                </span>
              )}
            </p>
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <div className="bg-blue-100 p-3 rounded-xl transition-transform duration-300 hover:scale-110">
            <div className="w-6 h-6 text-blue-600">
              {icon}
            </div>
          </div>
        </div>
      </div>
      
      {description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      )}
      
      {variant === 'featured' && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

export default StatCard