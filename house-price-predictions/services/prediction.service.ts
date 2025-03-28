import {
  PredictionInput,
  PredictionResult,
  HistoricalDataPoint,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getPrediction(
  input: PredictionInput
): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get prediction");
  }

  return response.json();
}

export async function getHistoricalData(): Promise<HistoricalDataPoint[]> {
  const response = await fetch(`${API_URL}/historical-data`);

  if (!response.ok) {
    throw new Error("Failed to fetch historical data");
  }

  return response.json();
}
