export type PropertyType = 'single_family' | 'multi_family' | 'condo' | 'apartment' | 'townhouse';

export interface PredictionInput {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  location_rating: number;
  property_age: number;
  has_garage: boolean;
  has_pool: boolean;
  school_quality: number;
  crime_rate: number;
  property_type: PropertyType;
}

export interface MonthlyTrend {
  month: string;
  price: number;
}

export interface Recommendation {
  title: string;
  description: string;
  valueIncrease: number;
}

export interface PredictionResult {
  predictedPrice: number;
  pricePerSqFt: number;
  confidence: number;
  potentialIncrease: {
    value: number;
    percentage: number;
  };
  recommendations: Recommendation[];
  marketComparison: {
    average: number;
    maximum: number;
    minimum: number;
  };
  priceForecast: MonthlyTrend[];
}

export interface HistoricalDataPoint {
  id: number;
  date: string;
  property_type: PropertyType;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  location_rating: number;
  property_age: number;
  has_garage: boolean;
  has_pool: boolean;
  school_quality: number;
  crime_rate: number;
  predicted_price: number;
  actual_price: number;
  sale_price: number;
}