import { ItineraryItem, NewItineraryItem } from '@/types/itinerary';

const STORAGE_KEY = 'tripper_itinerary_items';

export const storage = {
  getItems: (): ItineraryItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveItems: (items: ItineraryItem[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addItem: (item: NewItineraryItem): ItineraryItem => {
    const items = storage.getItems();
    const now = Date.now();
    const newItem: ItineraryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    storage.saveItems(items);
    return newItem;
  },

  updateItem: (id: string, updates: Partial<NewItineraryItem>): ItineraryItem | null => {
    const items = storage.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem: ItineraryItem = {
      ...items[index],
      ...updates,
      updatedAt: Date.now(),
    };
    items[index] = updatedItem;
    storage.saveItems(items);
    return updatedItem;
  },

  deleteItem: (id: string): boolean => {
    const items = storage.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    if (filteredItems.length === items.length) return false;
    storage.saveItems(filteredItems);
    return true;
  },

  getItem: (id: string): ItineraryItem | null => {
    const items = storage.getItems();
    return items.find(item => item.id === id) || null;
  },
};
