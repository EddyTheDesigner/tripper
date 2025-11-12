export interface ItineraryItem {
  id: string;
  title: string;
  url?: string;
  address?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type NewItineraryItem = Omit<ItineraryItem, 'id' | 'createdAt' | 'updatedAt'>;
