/**
 * Tipos oficiales para el ecosistema de cartas coleccionables CARDTEROS
 */

export type Sport = 'NFL' | 'NBA' | 'MLB' | 'Soccer' | 'F1' | 'TCG';

export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'SGC' | 'RAW';

export interface GradingInfo {
  company: GradingCompany;
  grade: string; // Ej: "10", "9.5", "Authentic"
  subgrades?: {
    centering?: number;
    corners?: number;
    edges?: number;
    surface?: number;
  };
  certNumber?: string;
}

export interface TradingCard {
  id: string;
  slug: string;
  name: string;
  athlete: string;
  sport: Sport;
  year: number;
  brand: string; // Topps, Panini, Bowman
  series: string; // Resurgence, Prizm, Chrome Update
  variation?: string; // Superfractor, Red Power Surge, Gold Refractor
  serialNumber?: string; // "1/1", "03/10", "25/99"
  isRookieCard?: boolean;
  isAutograph?: boolean;
  isPatch?: boolean;
  grading: GradingInfo;
  priceMxn: number;
  priceUsd?: number;
  imageUrl: string;
  compPriceMxn?: number; // Precio de referencia de mercado reciente
  inStock: boolean;
  featured?: boolean;
}

export interface BoxBreak {
  id: string;
  slug: string;
  title: string;
  sport: Sport;
  productType: 'Hobby Box' | 'Case Break' | 'Blaster Box' | 'Mega Box';
  breakType: 'Random Team' | 'Pick Your Team (PYT)' | 'Random Division';
  totalSpots: number;
  soldSpots: number;
  pricePerSpotMxn: number;
  streamDate: string; // ISO date o texto legible: "Hoy 8:00 PM CST"
  imageUrl: string;
  status: 'Open' | 'Few Spots Left' | 'Live Now' | 'Sold Out';
}

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  priceMxn: number;
  quantity: number;
  imageUrl: string;
  type: 'card' | 'break-spot' | 'box';
  gradeBadge?: string;
}
