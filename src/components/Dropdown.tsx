'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface DropdownOption {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  description?: string
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onSelect: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'filled'
  searchable?: boolean
  multiple?: boolean
  maxHeight?: string
  loading?: boolean
  emptyMessage?: string
}

const Dropdown = ({
  options,
  value,
  placeholder = 'Select an option',
  onSelect,
  disabled = false,
  error = false,
  className = '',
  size = 'md',
  variant = 'default',
  searchable = false,
  multiple = false,
  maxHeight = '200px',
  loading = false,
  emptyMessage = 'No options available'
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : []
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      
      setSelectedValues(newSelectedValues)
      onSelect(newSelectedValues.join(','))
    } else {
      onSelect(optionValue)
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  const getSelectedOption = () => {
    if (multiple) {
      return selectedValues.length > 0
        ? `${selectedValues.length} selected`
        : placeholder
    }
    return options.find(option => option.value === value)?.label || placeholder
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-4 py-3 text-lg'
      default:
        return 'px-4 py-2.5 text-base'
    }
  }

  const getVariantClasses = () => {
    const baseClasses = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2'
    
    if (error) {
      return `${baseClasses} border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200`
    }

    switch (variant) {
      case 'outline':
        return `${baseClasses} border-gray-300 bg-transparent hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200`
      case 'filled':
        return `${baseClasses} border-gray-200 bg-gray-50 hover:bg-gray-100 focus:border-blue-500 focus:ring-blue-200`
      default:
        return `${baseClasses} border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200`
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`truncate ${!value && !selectedValues.length ? 'text-gray-500' : 'text-gray-900'}`}>
          {getSelectedOption()}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ maxHeight }}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
          )}
          
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Loading...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? selectedValues.includes(option.value)
                  : value === option.value
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full flex items-center px-4 py-3 text-left transition-colors duration-150
                      ${option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50 cursor-pointer'
                      }
                      ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.icon && (
                      <span className="mr-3 flex-shrink-0">
                        {option.icon}
                      </span>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown