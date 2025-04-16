import { useState } from 'react';
import { UserList } from '@/components/messages/UserList';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MessagesLayout() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-gradient-to-br from-[var(--background-start)] to-[var(--background-end)]">
      {/* Left Sidebar */}
      <div className="w-96 border-r border-white/10 flex flex-col">
        <div className="p-4 glass-card m-4 rounded-2xl">
          <div className="search-container relative">
            <Input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10 pr-4 py-2 w-full rounded-xl bg-white/80"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          <UserList
            onSelectUser={setSelectedUserId}
            selectedUserId={selectedUserId}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="glass-card m-4 p-4 rounded-2xl flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-[var(--text-primary)]">
                  Sohbet
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Online • Son görülme 5 dk önce
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <div className="space-y-4">
                {/* Message bubbles will be rendered here */}
              </div>
            </div>

            {/* Message Input */}
            <div className="glass-card m-4 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 bg-white/80 border-0 rounded-xl focus:ring-2 focus:ring-[var(--accent-purple)]"
                />
                <button className="p-2 rounded-xl bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple)]/90 transition-colors">
                  <svg
                    className="w-5 h-5 rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-float">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-[var(--accent-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">
                Sohbete Başlayın
              </h3>
              <p className="text-[var(--text-secondary)]">
                Soldaki listeden bir kullanıcı seçin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 