import { SearchField, Label, Input } from "react-aria-components";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <SearchField value={value} onChange={onChange} className="w-full">
        <Label className="sr-only">Search modules</Label>
        <div className="relative">
          <Input
            className="w-full bg-white p-4 text-lg border rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search modules..."
          />
        </div>
      </SearchField>
    </div>
  );
}
