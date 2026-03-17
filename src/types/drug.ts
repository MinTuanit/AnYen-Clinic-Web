export interface Drug {
  id: string;
  medicine_id?: string;
  name: string;
  price: number | string;
  description?: string;
  category?: string;
  unit?: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
