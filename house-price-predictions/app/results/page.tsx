"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, HomeIcon, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "@/components/layout/layout";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    console.log("Raw data from URL:", data);
    if (data) {
      try {
        const decodedData = decodeURIComponent(data);
        console.log("Decoded data:", decodedData);
        const parsedData = JSON.parse(decodedData);
        console.log("Parsed JSON:", parsedData);
        setResult(parsedData);
      } catch (error) {
        console.error("Error parsing result data:", error);
      }
    }
  }, [searchParams]);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-lg text-muted-foreground mb-4">Loading results...</p>
          <Button variant="outline" asChild>
            <Link href="/predict">Back to Prediction Form</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="bg-primary/10 p-2 rounded-lg">
              <HomeIcon className="h-6 w-6 text-primary" />
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Property <span className="text-primary">Valuation Results</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's our prediction based on the property details you provided.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Estimated Price</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {result?.confidence ?? 0}% Confidence
                </span>
              </CardTitle>
              <CardDescription>Market valuation prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                ${result?.predicted_price?.toLocaleString() ?? "Loading..."}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Potential Value Increase</CardTitle>
              <CardDescription>After recommended improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold">
                  +{result?.potential_increase ?? 0}%
                </div>
                <div className="text-lg text-emerald-600 font-medium flex items-center mb-1">
                  <ArrowUpRight size={18} className="mr-1" />
                </div>
              </div>
              <Progress value={result?.potential_increase ?? 0} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Market Comparison</CardTitle>
            <CardDescription>How this property compares to the local market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Minimum", value: result?.historical_comparison?.minimum },
                    { name: "Average", value: result?.historical_comparison?.average },
                    { name: "This Property", value: result?.predicted_price },
                    { name: "Maximum", value: result?.historical_comparison?.maximum },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${parseInt(value.toString()).toLocaleString()}`, "Price"]} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
            <CardDescription>12-month price trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result?.monthly_trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${parseInt(value.toString()).toLocaleString()}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Recommendations to Increase Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result?.recommended_actions?.map((rec:any, index:number) => (
                <div key={index} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mt-1">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
