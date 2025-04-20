import { useState } from 'react';
import { Search } from './Search';
import { UserList } from './UserList';

export function MessagesLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[320px] flex flex-col border-r border-white/10">
        <div className="p-4">
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>
        <UserList
          searchQuery={searchQuery}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
        {selectedUserId ? (
          'Chat messages will be displayed here'
        ) : (
          'Select a user to start chatting'
        )}
      </div>
    </div>
  );
} 