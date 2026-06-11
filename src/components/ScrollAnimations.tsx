'use client';

import { useEffect, useRef } from 'react';
import { animate, onScroll, createScope } from 'animejs';

export default function ScrollAnimations() {
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    scopeRef.current = createScope().add(() => {
      
      // Animate glass cards when they scroll into view
      const cards = document.querySelectorAll('.glass-card');
      cards.forEach(card => {
        animate(card, {
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 800,
          ease: 'outQuart',
          autoplay: onScroll({
            target: card,
            // Triggers the animation when the element enters the viewport
          })
        });
      });

      // Animate section titles when they scroll into view
      const titles = document.querySelectorAll('.section-title');
      titles.forEach(title => {
        animate(title, {
          translateX: [-30, 0],
          opacity: [0, 1],
          duration: 800,
          ease: 'outBack',
          autoplay: onScroll({
            target: title,
          })
        });
      });

    });

    return () => {
      if (scopeRef.current) scopeRef.current.revert();
    };
  }, []);

  return null;
}
