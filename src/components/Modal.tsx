'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
  overlayClassName?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = ''
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md'
      case 'lg':
        return 'max-w-4xl'
      case 'xl':
        return 'max-w-6xl'
      case 'full':
        return 'max-w-full mx-4 my-4 h-[calc(100vh-2rem)]'
      default:
        return 'max-w-2xl'
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeOnEscape, onClose])

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${getSizeClasses()} 
          bg-white rounded-2xl shadow-2xl 
          transform transition-all duration-300
          animate-fade-in-up
          focus:outline-none
          ${size === 'full' ? 'flex flex-col' : ''}
          ${className}
        `}
        onClick={handleModalClick}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                  rounded-lg transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`${size === 'full' ? 'flex-1 overflow-auto' : ''} p-6`}>
          {children}
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at the end of body
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

// Modal Header Component
interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

export const ModalHeader = ({ children, className = '' }: ModalHeaderProps) => {
  return (
    <div className={`border-b border-gray-100 pb-4 mb-6 ${className}`}>
      {children}
    </div>
  )
}

// Modal Body Component
interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export const ModalBody = ({ children, className = '' }: ModalBodyProps) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  )
}

// Modal Footer Component
interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
  return (
    <div className={`border-t border-gray-100 pt-4 mt-6 flex justify-end space-x-3 ${className}`}>
      {children}
    </div>
  )
}

export default Modal