'use client'

import { useEffect } from 'react'
import { useMobileMenu } from '@/contexts/MobileMenuContext'

const JotFormAssistantManager = () => {
  const { isMenuOpen } = useMobileMenu()

  useEffect(() => {
    // Aggiungi/rimuovi classe CSS al body per gestire la visibilità tramite CSS
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }

    // Funzione per nascondere/mostrare l'assistente JotForm
    const toggleJotFormAssistant = (hide: boolean) => {
      // Cerca l'elemento JotForm (potrebbe avere diversi selettori)
      const jotformSelectors = [
        '[data-jotform-agent]',
        '.jotform-agent',
        '.jf-agent',
        '[id*="jotform"]',
        '[class*="jotform"]',
        '[class*="agent"]',
        'iframe[src*="jotform"]',
        // Selettori generici per widget di chat/assistenti
        '.chat-widget',
        '.assistant-widget',
        '.help-widget',
        '[class*="chat-button"]',
        '[class*="help-button"]'
      ]

      jotformSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          const htmlElement = element as HTMLElement
          if (hide) {
            htmlElement.style.display = 'none'
            htmlElement.style.visibility = 'hidden'
            htmlElement.style.opacity = '0'
            htmlElement.style.pointerEvents = 'none'
          } else {
            htmlElement.style.display = ''
            htmlElement.style.visibility = ''
            htmlElement.style.opacity = ''
            htmlElement.style.pointerEvents = ''
          }
        })
      })

      // Cerca anche elementi posizionati in basso a destra
      const allElements = document.querySelectorAll('*')
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement
        const computedStyle = window.getComputedStyle(htmlElement)
        
        // Controlla se l'elemento è posizionato in basso a destra
        const isBottomRight = (
          (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') &&
          (
            (computedStyle.bottom && computedStyle.bottom !== 'auto' && parseInt(computedStyle.bottom) < 100) ||
            (computedStyle.right && computedStyle.right !== 'auto' && parseInt(computedStyle.right) < 100)
          ) &&
          parseInt(computedStyle.zIndex || '0') > 10
        )

        if (isBottomRight && htmlElement.offsetWidth > 0 && htmlElement.offsetHeight > 0) {
          // Verifica se potrebbe essere un widget di assistenza
          const isLikelyAssistant = (
            htmlElement.textContent?.toLowerCase().includes('help') ||
            htmlElement.textContent?.toLowerCase().includes('chat') ||
            htmlElement.textContent?.toLowerCase().includes('support') ||
            htmlElement.className.toLowerCase().includes('chat') ||
            htmlElement.className.toLowerCase().includes('help') ||
            htmlElement.className.toLowerCase().includes('assistant') ||
            htmlElement.className.toLowerCase().includes('widget') ||
            htmlElement.tagName.toLowerCase() === 'iframe'
          )

          if (isLikelyAssistant) {
            if (hide) {
              htmlElement.style.display = 'none'
              htmlElement.style.visibility = 'hidden'
              htmlElement.style.opacity = '0'
              htmlElement.style.pointerEvents = 'none'
            } else {
              htmlElement.style.display = ''
              htmlElement.style.visibility = ''
              htmlElement.style.opacity = ''
              htmlElement.style.pointerEvents = ''
            }
          }
        }
      })
    }

    // Applica immediatamente lo stato corrente
    toggleJotFormAssistant(isMenuOpen)

    // Observer per elementi aggiunti dinamicamente
    const observer = new MutationObserver(() => {
      toggleJotFormAssistant(isMenuOpen)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [isMenuOpen])

  return null
}

export default JotFormAssistantManager