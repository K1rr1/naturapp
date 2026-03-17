export type PinCategory = "skräp" | "trasigt" | "belysning" | "övrigt";

export interface Pin {
  id: number;
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
  createdAt?: string;
  createdBy?: string;
};