'use client'

import { useEffect } from 'react'
import { useMobileMenu } from '@/contexts/MobileMenuContext'

const AIAssistant = () => {
  const { isMenuOpen } = useMobileMenu()

  useEffect(() => {
    // Funzione per nascondere/mostrare l'assistente JotForm
    const toggleJotFormWidget = (hide: boolean) => {
      // Cerca l'elemento JotForm nel DOM
      const jotformWidget = document.querySelector('[data-jotform-widget]') as HTMLElement
      const jotformIframe = document.querySelector('iframe[src*="jotfor.ms"]') as HTMLElement
      const jotformContainer = document.querySelector('.jotform-widget-container') as HTMLElement
      
      // Cerca anche per selettori più generici
      const jotformElements = [
        jotformWidget,
        jotformIframe,
        jotformContainer,
        ...Array.from(document.querySelectorAll('[id*="jotform"]')),
        ...Array.from(document.querySelectorAll('[class*="jotform"]')),
        ...Array.from(document.querySelectorAll('iframe[src*="cdn.jotfor.ms"]'))
      ].filter(Boolean) as HTMLElement[]

      jotformElements.forEach(element => {
        if (element) {
          if (hide) {
            // Nasconde l'elemento con transizione fluida
            element.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            element.style.opacity = '0'
            element.style.transform = 'translateY(20px)'
            element.style.pointerEvents = 'none'
            
            // Dopo la transizione, nasconde completamente
            setTimeout(() => {
              if (element.style.opacity === '0') {
                element.style.display = 'none'
              }
            }, 300)
          } else {
            // Mostra l'elemento con transizione fluida
            element.style.display = ''
            element.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            
            // Forza il reflow per applicare la transizione
            element.offsetHeight
            
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
            element.style.pointerEvents = 'auto'
          }
        }
      })
    }

    // Applica la logica di nascondere/mostrare
    toggleJotFormWidget(isMenuOpen)

    // Cleanup function
    return () => {
      // Assicurati che l'assistente sia visibile quando il componente viene smontato
      if (!isMenuOpen) {
        toggleJotFormWidget(false)
      }
    }
  }, [isMenuOpen])

  // Observer per elementi JotForm caricati dinamicamente
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            
            // Controlla se è un elemento JotForm
            if (
              element.matches('[data-jotform-widget]') ||
              element.matches('iframe[src*="jotfor.ms"]') ||
              element.matches('[id*="jotform"]') ||
              element.matches('[class*="jotform"]') ||
              element.querySelector('iframe[src*="jotfor.ms"]')
            ) {
              // Applica lo stato corrente del menu
              const targetElement = element as HTMLElement
              if (isMenuOpen) {
                targetElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
                targetElement.style.opacity = '0'
                targetElement.style.transform = 'translateY(20px)'
                targetElement.style.pointerEvents = 'none'
                targetElement.style.display = 'none'
              }
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [isMenuOpen])

  return null // Questo componente non renderizza nulla
}

export default AIAssistant