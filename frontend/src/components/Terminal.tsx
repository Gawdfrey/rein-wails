import { ReactNode } from "react";

interface TerminalProps {
  children: ReactNode;
  className?: string;
}

export function Terminal({ children, className = "" }: TerminalProps) {
  return (
    <div
      className={`bg-gray-900 rounded-lg flex-1 font-mono text-white overflow-y-auto ${className}`}
    >
      <div className="p-4">{children}</div>
    </div>
  );
}
