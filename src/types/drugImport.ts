import { Drug } from './drug';

export interface DrugImport {
  id: string;
  drug_id: string;
  batch_number: string;
  import_price: number | string;
  sold_price: number | string;
  quantity: number;
  remaining_quantity: number;
  import_date: string;
  expiration_date: string;
  supplier?: string;
  drug?: Drug;
  createdAt?: string;
  updatedAt?: string;
}

