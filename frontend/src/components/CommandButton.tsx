import { useKBar } from "kbar";

export function CommandButton() {
  const { query } = useKBar();

  return (
    <button
      onClick={query.toggle}
      className="fixed bottom-4 right-4 font-bold bg-surface-default cursor-pointer text-content-action-default p-3 rounded-full shadow-default"
    >
      ⌘K
      <span className="sr-only">Open Command Palette</span>
    </button>
  );
}
