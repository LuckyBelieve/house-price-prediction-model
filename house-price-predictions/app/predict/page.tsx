'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import Layout from '@/components/layout/layout';
import { PredictionInput, PropertyType } from '@/types';
import { getPrediction } from '@/services/prediction.service';

export default function PredictPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PredictionInput>({
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    location_rating: 7,
    property_age: 10,
    has_garage: true,
    has_pool: false,
    school_quality: 8,
    crime_rate: 3,
    property_type: "single_family"
  });

  const predictionMutation = useMutation({
    mutationFn: getPrediction,
    onSuccess: (data) => {
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to get prediction"
      );
    }
  });

  const handleInputChange = (key: keyof PredictionInput, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictionMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            House Price <span className="text-primary">Prediction</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter property details to get an accurate price estimation.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Property Details</h3>
            <p className="text-sm text-muted-foreground">
              Fill in the details below to get your property valuation.
            </p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="sqft" className="text-sm font-medium">Square Footage</label>
                  <input
                    id="sqft"
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))}
                    placeholder="Square footage"
                    min="500"
                    max="10000"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
                    <input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                      placeholder="Bedrooms"
                      min="1"
                      max="10"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</label>
                    <input
                      id="bathrooms"
                      type="number"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                      placeholder="Bathrooms"
                      min="1"
                      max="10"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="property_age" className="text-sm font-medium">Property Age (years)</label>
                  <input
                    id="property_age"
                    type="number"
                    value={formData.property_age}
                    onChange={(e) => handleInputChange('property_age', parseInt(e.target.value))}
                    placeholder="Property age"
                    min="0"
                    max="150"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location_rating" className="text-sm font-medium">Location Rating (1-10)</label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={formData.location_rating}
                    onChange={(e) => handleInputChange('location_rating', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="school_quality" className="text-sm font-medium">School Quality (1-10)</label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={formData.school_quality}
                    onChange={(e) => handleInputChange('school_quality', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="crime_rate" className="text-sm font-medium">Crime Rate (1-10)</label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={formData.crime_rate}
                    onChange={(e) => handleInputChange('crime_rate', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="has_garage"
                      checked={formData.has_garage}
                      onChange={(e) => handleInputChange('has_garage', e.target.checked)}
                      className="h-4 w-4 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <label htmlFor="has_garage" className="text-sm font-medium">Has Garage</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="has_pool"
                      checked={formData.has_pool}
                      onChange={(e) => handleInputChange('has_pool', e.target.checked)}
                      className="h-4 w-4 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <label htmlFor="has_pool" className="text-sm font-medium">Has Pool</label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Property Type</label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="single_family"
                        value="single_family"
                        name="property_type"
                        checked={formData.property_type === "single_family"}
                        onChange={() => handleInputChange('property_type', 'single_family' as PropertyType)}
                        className="h-4 w-4 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label htmlFor="single_family" className="text-sm font-medium">Single Family</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="multi_family"
                        value="multi_family"
                        name="property_type"
                        checked={formData.property_type === "multi_family"}
                        onChange={() => handleInputChange('property_type', 'multi_family' as PropertyType)}
                        className="h-4 w-4 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label htmlFor="multi_family" className="text-sm font-medium">Multi-Family</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="condo"
                        value="condo"
                        name="property_type"
                        checked={formData.property_type === "condo"}
                        onChange={() => handleInputChange('property_type', 'condo' as PropertyType)}
                        className="h-4 w-4 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label htmlFor="condo" className="text-sm font-medium">Condo/Apartment</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full max-w-xs"
                  disabled={predictionMutation.isPending}
                >
                  {predictionMutation.isPending ? "Processing..." : "Get Price Prediction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}