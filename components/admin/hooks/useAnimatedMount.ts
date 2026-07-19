import { useEffect, useState } from 'react';

export function useAnimatedMount(isOpen: boolean, duration = 200) {
  const [mounted, setMounted] = useState(isOpen);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    } else {
      setActive(false);
      const t = window.setTimeout(() => setMounted(false), duration);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, duration]);

  return { mounted, active };
}