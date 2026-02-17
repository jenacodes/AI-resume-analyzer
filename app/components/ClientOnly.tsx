import { useState, useEffect, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only on the client side.
 * On the server, renders the fallback (or nothing).
 *
 * Use this to wrap components that depend on browser-only APIs
 * (canvas, DOMMatrix, window, navigator, etc.)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : fallback;
}
