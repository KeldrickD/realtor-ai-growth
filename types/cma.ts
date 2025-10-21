export type Comp = {
  address: string;
  sold_price: number; // USD
  sold_date: string;  // ISO
  beds?: number;
  baths?: number;
  sqft?: number;
  dom?: number;
  list_price?: number;
  lot_sqft?: number;
  year_built?: number;
  condition?: string;
};

export type CMASummary = {
  subject_address?: string;
  model_version: string;
  stats: {
    n: number;
    median_ppsf?: number;
    avg_dom?: number;
    date_range?: { min: string; max: string };
  };
  suggested_price_range: { low: number; high: number; method: string };
  rationale: string[];
  risks: string[];
  talking_points: string[];
  notes?: string;
};


