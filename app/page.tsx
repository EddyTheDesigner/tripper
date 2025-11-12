'use client';

import { useState, useEffect } from 'react';
import ItineraryList from '@/components/ItineraryList';
import ItineraryDetail from '@/components/ItineraryDetail';
import { ItineraryItem } from '@/types/itinerary';
import { storage } from '@/lib/storage';

export default function Home() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load items from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const loadedItems = storage.getItems();
    setItems(loadedItems);

    // Sort by most recently updated
    loadedItems.sort((a, b) => b.updatedAt - a.updatedAt);
  }, []);

  const handleAddItem = () => {
    const newItem = storage.addItem({
      title: 'New Entry',
      url: '',
      address: '',
      notes: '',
    });
    const updatedItems = storage.getItems();
    updatedItems.sort((a, b) => b.updatedAt - a.updatedAt);
    setItems(updatedItems);
    setSelectedId(newItem.id);
  };

  const handleUpdateItem = (updates: Partial<ItineraryItem>) => {
    if (!selectedId) return;
    storage.updateItem(selectedId, updates);
    const updatedItems = storage.getItems();
    updatedItems.sort((a, b) => b.updatedAt - a.updatedAt);
    setItems(updatedItems);
  };

  const handleDeleteItem = () => {
    if (!selectedId) return;
    storage.deleteItem(selectedId);
    const updatedItems = storage.getItems();
    updatedItems.sort((a, b) => b.updatedAt - a.updatedAt);
    setItems(updatedItems);
    setSelectedId(null);
  };

  const selectedItem = selectedId
    ? items.find((item) => item.id === selectedId) || null
    : null;

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <main className="h-screen flex">
      {/* Left Sidebar - List */}
      <div className="w-80 flex-shrink-0">
        <ItineraryList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAddItem}
        />
      </div>

      {/* Main Content - Detail/Edit */}
      <div className="flex-1">
        <ItineraryDetail
          item={selectedItem}
          onSave={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      </div>
    </main>
  );
}
