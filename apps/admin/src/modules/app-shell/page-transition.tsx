import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {children}
    </div>
  );
}
