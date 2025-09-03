'use client'

import { ReactNode, useState, useEffect } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
  className?: string
  tabsClassName?: string
  contentClassName?: string
}

const Tabs = ({
  items,
  defaultTab,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  className = '',
  tabsClassName = '',
  contentClassName = ''
}: TabsProps) => {
  const [currentTab, setCurrentTab] = useState(
    activeTab || defaultTab || items[0]?.id || ''
  )

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) {
      setCurrentTab(activeTab)
    }
  }, [activeTab])

  const handleTabClick = (tabId: string) => {
    const tab = items.find(item => item.id === tabId)
    if (tab && !tab.disabled) {
      setCurrentTab(tabId)
      onTabChange?.(tabId)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-3 text-base'
    }
  }

  const getVariantClasses = (isActive: boolean, isDisabled: boolean) => {
    const baseClasses = 'transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    if (isDisabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed text-gray-400`
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${
          isActive
            ? 'bg-blue-600 text-white shadow-md focus:ring-blue-500'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
        }`
      
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive
            ? 'border-blue-600 text-blue-600 focus:ring-blue-500'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 focus:ring-gray-500'
        }`
      
      case 'cards':
        return `${baseClasses} border rounded-lg ${
          isActive
            ? 'bg-white border-blue-200 text-blue-700 shadow-sm focus:ring-blue-500'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500'
        }`
      
      default:
        return `${baseClasses} rounded-lg ${
          isActive
            ? 'bg-blue-50 text-blue-700 focus:ring-blue-500'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500'
        }`
    }
  }

  const getTabsContainerClasses = () => {
    const baseClasses = orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-1'
    const widthClasses = fullWidth && orientation === 'horizontal' ? 'w-full' : ''
    
    if (variant === 'underline') {
      return `flex ${baseClasses} ${widthClasses} border-b border-gray-200`
    }
    
    if (variant === 'cards') {
      return `flex ${baseClasses} ${widthClasses} bg-gray-100 p-1 rounded-lg`
    }
    
    return `flex ${baseClasses} ${widthClasses}`
  }

  const getTabClasses = (item: TabItem) => {
    const isActive = currentTab === item.id
    const sizeClasses = getSizeClasses()
    const variantClasses = getVariantClasses(isActive, item.disabled || false)
    const widthClasses = fullWidth && orientation === 'horizontal' ? 'flex-1 text-center' : ''
    
    return `${sizeClasses} ${variantClasses} ${widthClasses} flex items-center justify-center gap-2 whitespace-nowrap`
  }

  const activeTabContent = items.find(item => item.id === currentTab)?.content

  return (
    <div className={`${className} ${orientation === 'vertical' ? 'flex gap-6' : ''}`}>
      {/* Tab Navigation */}
      <div className={`${getTabsContainerClasses()} ${tabsClassName}`} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={currentTab === item.id}
            aria-controls={`tabpanel-${item.id}`}
            disabled={item.disabled}
            onClick={() => handleTabClick(item.id)}
            className={getTabClasses(item)}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {item.icon}
              </span>
            )}
            
            <span className="truncate">{item.label}</span>
            
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`mt-4 ${contentClassName} ${orientation === 'vertical' ? 'flex-1 mt-0' : ''}`}
        role="tabpanel"
        id={`tabpanel-${currentTab}`}
        aria-labelledby={`tab-${currentTab}`}
      >
        {activeTabContent}
      </div>
    </div>
  )
}

// Compound Components for better API
export const TabList = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`flex space-x-1 ${className}`} role="tablist">
    {children}
  </div>
)

export const Tab = ({
  children,
  isActive = false,
  disabled = false,
  onClick,
  className = ''
}: {
  children: ReactNode
  isActive?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    disabled={disabled}
    onClick={onClick}
    className={`
      px-4 py-2 font-medium rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${
        disabled
          ? 'opacity-50 cursor-not-allowed text-gray-400'
          : isActive
          ? 'bg-blue-50 text-blue-700 focus:ring-blue-500'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500'
      }
      ${className}
    `}
  >
    {children}
  </button>
)

export const TabPanels = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
)

export const TabPanel = ({
  children,
  isActive = false,
  className = ''
}: {
  children: ReactNode
  isActive?: boolean
  className?: string
}) => {
  if (!isActive) return null
  
  return (
    <div className={`${className}`} role="tabpanel">
      {children}
    </div>
  )
}

export default Tabs