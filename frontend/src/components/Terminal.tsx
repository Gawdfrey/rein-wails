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
      <div className="flex items-center gap-1.5 left-4 top-4 relative pb-4">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
