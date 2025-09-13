'use client';

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  enableServiceWorker?: boolean;
}

export default function PerformanceOptimizer({
  preloadImages = [],
  preloadFonts = [],
  enableServiceWorker = false
}: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical images
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    preloadFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Enable service worker for caching
    if (enableServiceWorker && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          // Service Worker registered successfully
        })
        .catch(registrationError => {
          // Service Worker registration failed
        });
    }

    // Optimize images with Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, [preloadImages, preloadFonts, enableServiceWorker]);

  // Performance monitoring
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            // Largest Contentful Paint measured
          }
          if (entry.entryType === 'first-input') {
            // First Input Delay measured
          }
          if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              // Cumulative Layout Shift measured
            }
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        // Performance monitoring not fully supported
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// Hook for performance optimization
export function usePerformanceOptimization() {
  useEffect(() => {
    // Optimize scroll performance
    let ticking = false;
    
    const updateScrollPosition = () => {
      ticking = false;
      // Add scroll-based optimizations here
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  // Debounce resize events
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Handle resize optimizations
        window.dispatchEvent(new Event('optimizedResize'));
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
}