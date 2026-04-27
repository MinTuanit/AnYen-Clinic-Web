export interface Drug {
  id: string;
  name: string;
  description?: string;
  unit?: 'tablet' | 'bottle' | 'tube' | 'box' | 'other';
  stock?: number; // Aggregate field from backend
  price?: number | string; // Aggregate field from backend
  createdAt?: string;
  updatedAt?: string;
}

