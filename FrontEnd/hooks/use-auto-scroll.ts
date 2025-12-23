// hooks/use-auto-scroll.ts
import { useEffect, RefObject } from 'react';

interface UseAutoScrollProps {
  scrollRef?: RefObject<HTMLElement> | null;
  data: any[] | undefined;
  mounted: boolean;
  intervalMs?: number; // Optional, defaults to 7000
}

export function useAutoScroll({ 
  scrollRef, 
  data, 
  mounted, 
  intervalMs = 7000 
}: UseAutoScrollProps) {
  useEffect(() => {
    if (!mounted || !data || data.length <= 4) return;
    const scrollContainer = scrollRef!.current;
    if (!scrollContainer) return;
    const autoScroll = () => {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainer;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollTo({ 
          left: scrollLeft + clientWidth, 
          behavior: 'smooth' 
        });
      }
    };

    const interval = setInterval(autoScroll, intervalMs);
    return () => clearInterval(interval);
  }, [mounted, data, scrollRef, intervalMs]);
}