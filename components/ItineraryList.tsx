'use client';

import { ItineraryItem } from '@/types/itinerary';
import ThemeToggle from './ThemeToggle';

interface ItineraryListProps {
  items: ItineraryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export default function ItineraryList({
  items,
  selectedId,
  onSelect,
  onAdd,
}: ItineraryListProps) {
  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tripper</h1>
          <ThemeToggle />
        </div>
        <button
          onClick={onAdd}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Entry
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No entries yet.</p>
            <p className="text-sm mt-1">Click &quot;New Entry&quot; to get started.</p>
          </div>
        ) : (
          <div className="p-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-150 ${
                  selectedId === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {item.title || 'Untitled'}
                </h3>
                <div className="space-y-1">
                  {item.address && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {item.address}
                    </p>
                  )}
                  {item.url && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      {item.url}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
