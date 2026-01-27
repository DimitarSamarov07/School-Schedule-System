// hooks/use-auto-scroll.ts
import { useEffect, RefObject } from 'react';

interface UseAutoScrollProps {
  scrollRef?: RefObject<HTMLElement> | null;
  data: never[] | undefined;
  mounted: boolean;
  intervalMs?: number;
}

/**
 * A custom hook to enable automatic scrolling for a horizontally scrollable container.
 * It scrolls the content at a specified interval and resets to the start once the end is reached.
 *
 * @param {Object} options An object containing the configuration for the auto-scroll behavior.
 * @param {React.RefObject<HTMLElement>} options.scrollRef A reference to the scrollable container element.
 * @param {Array} options.data The data to be displayed in the scrollable container. Used to determine the need for scrolling.
 * @param {boolean} options.mounted A flag indicating if the component is mounted.
 * @param {number} [options.intervalMs=7000] The time interval (in milliseconds) for scrolling movements. Defaults to 7000ms.
 * @return {void} This hook does not return any value.
 */
export function useAutoScroll({
  scrollRef, 
  data, 
  mounted, 
  intervalMs = 7000 
}: UseAutoScrollProps): void {
  useEffect(() => {
    if (!mounted || !data || data.length <= 4) return;
    const scrollContainer = scrollRef!.current;
    if (!scrollContainer) return;
    const autoScroll = () => {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainer;
      if (scrollLeft + clientWidth >= scrollWidth - 250) {
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