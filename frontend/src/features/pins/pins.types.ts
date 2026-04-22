export type PinCategory = "skräp" | "trasigt" | "belysning" | "övrigt";

export type CategoryFilter = "alla" | PinCategory;

export type OwnerFilter = "alla" | "mina" | "andras";

export type EventFilter = "alla" | "medEvent" | "utanEvent" | "deltar";


export type CleanupEvent = {
  date: string;
  time: string;
  note: string;
  participants: string[];
  
};
export type StatusFilter = "öppna" | "åtgärdade" ;
export type PinStatus = "öppen" | "åtgärdad";

export type Pin = {
 
  id: number;
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
  createdBy: string;
  createdAt: string;
  status?: PinStatus;
  cleanupEvent?: CleanupEvent;
};