import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 text-purple-600 font-bold drop-shadow-md" strokeWidth={2.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Kullanıcı ara..."
        className="w-full h-11 pl-14 pr-4 rounded-2xl bg-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] border-none outline-none focus:ring-2 focus:ring-white/20 transition-all"
      />
    </div>
  );
} 