export type PinCategory = "skräp" | "farligt avfall" | "naturvård" | "annat";

export interface Pin {
  id: number;
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
  createdAt?: string;
  createdBy?: string;
};